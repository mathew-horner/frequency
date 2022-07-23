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

  // Edit a habit.
  .mutation("edit", {
    input: z.object({
      habitId: z.number().int(),
      title: z.string(),
      frequency: z.number().int(),
    }),
    async resolve({ input, ctx }) {
      const { session } = ctx as any;
      const { habitId, title, frequency } = input;

      const habitOwner = (
        await prisma.habit.findUnique({
          where: { id: habitId },
          select: { userId: true },
        })
      )?.userId;

      if (habitOwner === undefined) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Could not find a Habit with that ID!",
        });
      }

      if (session.user.id !== habitOwner) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only edit your own Habits!",
        });
      }

      return prisma.habit.update({
        where: { id: habitId },
        data: {
          title,
          frequency,
        },
      });
    },
  })

  // Delete a habit.
  .mutation("delete", {
    input: z.object({
      habitId: z.number().int(),
    }),
    async resolve({ input, ctx }) {
      const { session } = ctx as any;
      const { habitId } = input;

      const habitOwner = (
        await prisma.habit.findUnique({
          where: { id: habitId },
          select: { userId: true },
        })
      )?.userId;

      if (habitOwner === undefined) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Could not find a Habit with that ID!",
        });
      }

      if (session.user.id !== habitOwner) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only delete your own Habits!",
        });
      }
      
      await prisma.habitDay.deleteMany({
        where: { habitId }
      })

      return prisma.habit.delete({
        where: { id: habitId },
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
          AND "Habit"."createdOn" <= '${date.toString()}'
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
