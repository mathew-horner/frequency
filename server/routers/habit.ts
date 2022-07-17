import { HabitStatus } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../utils/db";
import { TodayHabit } from "../../utils/types";

export const habitRouter = trpc
  .router()

  // Create a new habit for the requesting user.
  .mutation("create", {
    input: z.object({
      title: z.string(),
      frequency: z.number().int(),
      dateTimestamp: z.number().int(),
    }),
    resolve({ input, ctx }) {
      const { session } = ctx as any;

      if (!session?.user?.id) {
        return null;
      }

      return prisma.habit.create({
        data: {
          userId: session.user.id,
          title: input.title,
          createdOn: new Date(input.dateTimestamp),
        },
      });
    },
  })

  // Get a list of all of the requesting user's habits.
  .query("list", {
    input: z.object({
      dateTimestamp: z.number().int(),
    }),
    async resolve({ input: { dateTimestamp }, ctx }) {
      const { session } = ctx as any;

      if (!session?.user?.id) {
        return [];
      }

      const habits = await prisma.habit.findMany({
        where: { userId: session.user.id },
      });

      const date = new Date(dateTimestamp);

      return Promise.all(
        habits.map(async (habit) => {
          const today = await prisma.habitDay.findFirst({
            where: { habitId: habit.id, date },
          });

          const lastComplete = await prisma.habitDay.findFirst({
            where: { habitId: habit.id, status: HabitStatus.Complete },
            orderBy: { date: "desc" },
            select: { date: true },
          });

          const lastCompletionDate = !!lastComplete
            ? lastComplete.date
            : (() => {
                const { createdOn } = habit;
                createdOn.setDate(createdOn.getDate() - 1);
                return createdOn;
              })();

          const dueDate = new Date();
          dueDate.setDate(lastCompletionDate.getDate() + habit.frequency);

          const dueIn = Math.floor(
            (dueDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
          );

          return {
            ...habit,
            today: today || undefined,
            dueIn,
          } as TodayHabit;
        })
      );
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
      if (!session?.user?.id) {
        return null;
      }

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
