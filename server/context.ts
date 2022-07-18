import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  async function getSession() {
    if (opts?.req && opts?.res) {
      return await unstable_getServerSession(opts.req, opts.res, authOptions);
    }
    return null;
  }

  const session = await getSession();

  if (!session?.user) {
    throw new trpc.TRPCError({
      code: "UNAUTHORIZED",
      message: "No session provided!",
    });
  }

  return {
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
