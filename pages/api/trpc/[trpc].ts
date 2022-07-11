import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { habitRouter } from "../../../server/routers/habit";

export const appRouter = trpc.router().merge("habit.", habitRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
