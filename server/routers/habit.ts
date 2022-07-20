import { HabitStatus } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";
import prisma from "../../utils/prisma";
import { calculateDueIn, normalizeDate } from "../../utils/date";

export const habitRouter = trpc
  .router()

  // Create a new habit for the requesting user.
  .mutation("create", {
    input: z.object({
      title: z.string(),
      frequency: z.number().int(),
      dateTimestamp: z.number().int(),
      start: z.enum(["Today", "Tomorrow"]),
    }),
    resolve({ input, ctx }) {
      const { session } = ctx as any;
      const createdOn = new Date(input.dateTimestamp);

      if (input.start === "Tomorrow") {
        createdOn.setDate(createdOn.getDate() + 1);
      }

      return prisma.habit.create({
        data: {
          userId: session.user.id,
          title: input.title,
          frequency: input.frequency,
          createdOn,
        },
      });
    },
  })

  .query("list", {
    input: z.object({
      dateTimestamp: z.number().int(),
    }),
    async resolve({ input: { dateTimestamp }, ctx }) {
      const { session } = ctx as any;
      const date = normalizeDate(new Date(dateTimestamp));

      // TODO: Need to create a type for this.
      const results: any = await prisma.$queryRaw`
        WITH
        habit_days AS (
          SELECT * FROM "HabitDay" ORDER BY "date" DESC
        ),
        last_completion_days AS (
          SELECT DISTINCT ON ("habitId")
            "habitId",
            FIRST_VALUE("date") OVER (PARTITION BY "habitId") AS "date"
          FROM habit_days 
          WHERE "status" = 'Complete'
        )
        SELECT
          "Habit".*,
          COALESCE("today"."status", 'Pending') as "todayStatus",
          last_completion_days."date" as "lastCompleteDate"
        FROM "Habit"
        LEFT JOIN habit_days AS "today"
          ON "Habit"."id" = "today"."habitId"
          AND "today"."date" = '2022-07-19 00:00:00' 
        LEFT JOIN last_completion_days
          ON "Habit"."id" = last_completion_days."habitId"
        WHERE "userId" = ${session.user.id}
      `;

      return results.map((result: any) => {
        const dueIn = calculateDueIn({
          lastCompleteDate: result.lastCompleteDate,
          createdOn: result.createdOn,
          frequency: result.frequency,
          today: date,
        });

        return {
          ...result,
          dueIn,
          streak: 0,
        };
      });
    },
  })

  // Set the status of a habit.
  .mutation("setStatus", {
    input: z.object({
      habitId: z.number().int(),
      dateTimestamp: z.number().int(),
      status: z.enum([
        HabitStatus.Incomplete,
        HabitStatus.Complete,
        HabitStatus.Pending,
      ]),
    }),
    async resolve({ input: { habitId, dateTimestamp, status }, ctx }) {
      const { session } = ctx as any;

      const habit = await prisma.habit.findUnique({ where: { id: habitId } });
      if (!habit) {
        return null;
      }

      // Restrict users to only setting the status of their own habits.
      if (habit.userId !== session.user.id) {
        return null;
      }

      const date = new Date(dateTimestamp);

      try {
        await prisma.habitDay.upsert({
          create: {
            habitId,
            status,
            date,
          },
          update: {
            status,
          },
          where: {
            habitId_date: {
              habitId,
              date,
            },
          },
        });
      } catch (ex) {
        console.error(ex);
        return false;
      }

      return true;
    },
  });
