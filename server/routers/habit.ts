import { HabitStatus } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";

import prisma from "../../utils/prisma";
import { Day, calculateDueIn } from "../../utils/date";
import { DbHabitListResult } from "../../utils/types";

export const habitRouter = trpc
  .router()

  // Create a new habit for the requesting user.
  .mutation("create", {
    input: z.object({
      title: z.string(),
      frequency: z.number().int(),
      start: z.enum(["Today", "Tomorrow"]),
      date: z.object({
        year: z.number().int(),
        month: z.number().int(),
        day: z.number().int(),
      }),
    }),
    resolve({ input, ctx }) {
      const { session } = ctx as any;
      const createdOn = new Day(
        input.date.year,
        input.date.month,
        input.date.day
      );

      if (input.start === "Tomorrow") {
        createdOn.addDays(1);
      }

      return prisma.habit.create({
        data: {
          userId: session.user.id,
          title: input.title,
          frequency: input.frequency,
          createdOn: createdOn.date(),
        },
      });
    },
  })

  // Get a list of the requesting user's habits.
  .query("list", {
    input: z.object({
      date: z.object({
        year: z.number().int(),
        month: z.number().int(),
        day: z.number().int(),
      }),
    }),
    async resolve({
      input: {
        date: { year, month, day },
      },
      ctx,
    }) {
      const { session } = ctx as any;
      const date = new Day(year, month, day);

      const results: DbHabitListResult[] = await prisma.$queryRawUnsafe(`
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
          AND "today"."date" = '${date.toString()}'
        LEFT JOIN last_completion_days
          ON "Habit"."id" = last_completion_days."habitId"
        WHERE "userId" = '${session.user.id}'
      `);

      return results.map((result) => {
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
      date: z.object({
        year: z.number().int(),
        month: z.number().int(),
        day: z.number().int(),
      }),
      status: z.enum([
        HabitStatus.Incomplete,
        HabitStatus.Complete,
        HabitStatus.Pending,
      ]),
    }),
    async resolve({ input: { habitId, date: { year, month, day }, status }, ctx }) {
      const { session } = ctx as any;

      const habit = await prisma.habit.findUnique({ where: { id: habitId } });
      if (!habit) {
        return null;
      }

      // Restrict users to only setting the status of their own habits.
      if (habit.userId !== session.user.id) {
        return null;
      }

      const date = new Day(year, month, day);

      try {
        await prisma.habitDay.upsert({
          create: {
            habitId,
            status,
            date: date.date(),
          },
          update: {
            status,
          },
          where: {
            habitId_date: {
              habitId,
              date: date.date(),
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
