import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { habitRouter } from "../../../server/routers/habit";
import { Context, createContext } from "../../../server/context";

export const appRouter = trpc.router<Context>().merge("habit.", habitRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
