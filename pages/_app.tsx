import "@fontsource/andika/400.css";
import "@fontsource/andika/700.css";

import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { SessionProvider, useSession } from "next-auth/react";

import { AppRouter } from "./api/trpc/[trpc]";
import theme from "../utils/theme";
import { trpc } from "../utils/trpc";
import GlobalContext from "../contexts/GlobalContext";

import "../styles/globals.css";

function BaseApp(props: AppProps) {
  const session = props?.pageProps?.session;
  return (
    <SessionProvider session={session}>
      <MyApp {...props} />
    </SessionProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const { status  } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoadingAuth = status === "loading";

  const userSettingsGet = trpc.useQuery(["settings.get"], {
    enabled: isAuthenticated
  });
  
  if (isLoadingAuth) return null;

  const settings = userSettingsGet.data;

  if (isAuthenticated && !settings) return null;

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  return (
    <>
      <Head>
        <title>frequency</title>
      </Head>
      <GlobalContext {...{ theme, settings }}>
        {getLayout(<Component {...pageProps} />)}
      </GlobalContext>
    </>
  );
}

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(BaseApp);
