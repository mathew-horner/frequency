import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "../../../utils/db";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    }
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
