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
    async resolve() {
      const habits = await prisma.habit.findMany();
      return habits.map(
        (habit) => ({ ...habit, today: undefined } as TodayHabit)
      );
    },
  });
