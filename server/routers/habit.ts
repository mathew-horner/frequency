import { HabitStatus } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";

import prisma from "../../utils/prisma";
import { calculateDueIn } from "../../utils/date";
import JustDate, { JustDateSchema } from "../../utils/justDate";
import { DbHabitListResult } from "../../utils/types";

export const habitRouter = trpc
  .router()

  // Create a new habit for the requesting user.
  .mutation("create", {
    input: z.object({
      title: z.string(),
      frequency: z.number().int(),
      start: z.enum(["Today", "Tomorrow"]),
      date: JustDateSchema,
    }),
    resolve({ input, ctx }) {
      const { session } = ctx as any;
      const { year, month, day } = input.date;
      const createdOn = new JustDate(year, month, day);

      if (input.start === "Tomorrow") {
        createdOn.addDays(1);
      }

      return prisma.habit.create({
        data: {
          userId: session.user.id,
          title: input.title,
          frequency: input.frequency,
          createdOn: createdOn.jsDateUtc(),
        },
      });
    },
  })

  // Get a list of the requesting user's habits.
  .query("list", {
    input: z.object({
      date: JustDateSchema,
    }),
    async resolve({ input, ctx }) {
      const { session } = ctx as any;
      const { year, month, day } = input.date;

      const date = new JustDate(year, month, day);

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
          lastCompleteDate: result.lastCompleteDate
            ? JustDate.fromJsDateUtc(result.lastCompleteDate)
            : undefined,
          createdOn: JustDate.fromJsDateUtc(result.createdOn),
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

  // Get a list of all of the requesting user's habits.
  // .query("list", {
  //   input: z.object({
  //     date: JustDateSchema,
  //   }),
  //   async resolve({ input, ctx }) {
  //     const { session } = ctx as any;
  //     const { year, month, day } = input.date;

  //     const habits = await prisma.habit.findMany({
  //       where: { userId: session.user.id },
  //     });

  //     const date = new JustDate(year, month, day);

  //     return Promise.all(
  //       habits.map(async (habit) => {
  //         const today = await prisma.habitDay.findFirst({
  //           where: { habitId: habit.id, date: date.jsDateUtc() },
  //         });

  //         const lastComplete = await prisma.habitDay.findFirst({
  //           where: { habitId: habit.id, status: HabitStatus.Complete },
  //           orderBy: { date: "desc" },
  //           select: { date: true },
  //         });

  //         const dueIn = calculateDueIn({
  //           habit,
  //           today: date,
  //           lastCompleteDate: !!lastComplete?.date
  //             ? JustDate.fromJsDateUtc(lastComplete.date)
  //             : undefined,
  //         });

  //         const streak = await getHabitStreak(habit, date.jsDateUtc());

  //         return {
  //           ...habit,
  //           today: today || undefined,
  //           dueIn,
  //           streak,
  //         } as TodayHabit;
  //       })
  //     );
  //   },
  // })

  // Set the status of a habit.
  .mutation("setStatus", {
    input: z.object({
      habitId: z.number().int(),
      status: z.enum([
        HabitStatus.Incomplete,
        HabitStatus.Complete,
        HabitStatus.Pending,
      ]),
      date: JustDateSchema,
    }),
    async resolve({ input, ctx }) {
      const { session } = ctx as any;
      const { habitId, status } = input;
      const { year, month, day } = input.date;

      const habit = await prisma.habit.findUnique({ where: { id: habitId } });
      if (!habit) {
        return null;
      }

      // Restrict users to only setting the status of their own habits.
      if (habit.userId !== session.user.id) {
        return null;
      }

      const date = new JustDate(year, month, day);

      try {
        await prisma.habitDay.upsert({
          create: {
            habitId,
            status,
            date: date.jsDateUtc(),
          },
          update: {
            status,
          },
          where: {
            habitId_date: {
              habitId,
              date: date.jsDateUtc(),
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
