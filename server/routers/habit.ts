import { HabitStatus } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../utils/db";
import { TodayHabit } from "../../utils/types";

export const habitRouter = trpc
  .router()
  .mutation("create", {
    input: z.object({
      title: z.string(),
      frequency: z.number().int(),
    }),
    resolve({ input }) {
      return prisma.habit.create({ data: { userId: "1", title: input.title } });
    },
  })
  .query("list", {
    input: z.object({
      dateTimestamp: z.number().int(),
    }),
    async resolve({ input: { dateTimestamp } }) {
      const habits = await prisma.habit.findMany();
      const date = new Date(dateTimestamp);

      return Promise.all(
        habits.map(async (habit) => {
          const today = await prisma.habitDay.findFirst({
            where: { habitId: habit.id, date },
          });
          return {
            ...habit,
            today: today || undefined,
            dueIn: 0,
          } as TodayHabit;
        })
      );
    },
  })
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
    async resolve({ input: { habitId, dateTimestamp, status } }) {
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
