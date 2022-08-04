import * as trpc from "@trpc/server";
import { ViewMode } from "@prisma/client";
import z from "zod";

import prisma from "../../utils/prisma";

const INITIAL_SETTINGS = {
  viewMode: ViewMode.Standard,
};

export const settingsRouter = trpc
  .router()

  // Get settings for the requesting user.
  .query("get", {
    async resolve({ ctx }) {
      const { session } = ctx as any;
      const settings = await prisma.userSettings.findUnique({
        where: { userId: session.user.id },
      });

      if (settings) return settings;

      return prisma.userSettings.create({
        data: {
          ...INITIAL_SETTINGS,
          userId: session.user.id,
        }
      });
    }})

    // Update settings for the requesting user.
    .mutation("update", {
      input: z.object({
        viewMode: z.enum(["Standard", "Compact"]),
        hiddenHabitDueInThreshold: z.number().int().nullish(),
      }),
      resolve({ ctx, input }) {
        const { session } = ctx as any;
        return prisma.userSettings.update({
          where: { userId: session.user.id },
          data: input,
        })
      }
    });
  
