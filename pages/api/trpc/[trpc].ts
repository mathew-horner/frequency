import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import Cors from "cors";
import { habitRouter } from "../../../server/routers/habit";
import { Context, createContext } from "../../../server/context";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const appRouter = trpc.router<Context>().merge("habit.", habitRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
const trpcHandler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

export default async function handler(req: any, res: any) {
  await runMiddleware(req, res, cors);

  return trpcHandler(req, res);
}
