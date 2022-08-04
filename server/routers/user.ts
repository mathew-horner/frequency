import * as trpc from "@trpc/server";
import prisma from "../../utils/prisma";

export const userRouter = trpc
  .router()

  // Delete user
  .mutation("delete", {
    async resolve({ ctx }) {
      const { session } = ctx as any;

      // TODO: Should probably set up proper cascading deletes here...

      await prisma.userSettings.delete({
        where: {
          userId: session.user.id,
        }
      });

      await prisma.habitDay.deleteMany({
        where: {
          habit: {
            userId: session.user.id,
          }
        },
      });

      await prisma.habit.deleteMany({
        where: {
          userId: session.user.id,
        }
      });

      await prisma.user.delete({
        where: {
          id: session.user.id,
        }
      });
    }
  });
