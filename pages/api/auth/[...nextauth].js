import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import prisma from "../../../utils/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    // redirect({ baseUrl }) {
    //   return `${baseUrl}/app`;
    // },
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
