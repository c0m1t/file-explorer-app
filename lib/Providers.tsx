import type { NextPage as NextNextPage } from "next";
import type { AppProps as NextAppProps } from "next/app";
import { ThemeProvider } from "next-themes";

export type NextPage<P = {}, IP = P> = NextNextPage<P, IP> & {
  forcedTheme?: string;
};

export type AppProps = NextAppProps & {
  Component: NextPage;
};

export type AppProvidersProps = AppProps & {
  children?: React.ReactNode;
};

export default function AppProviders(props: AppProvidersProps) {
  const { children, Component } = props;

  return (
    <ThemeProvider attribute="class" forcedTheme={Component.forcedTheme}>
      {children}
    </ThemeProvider>
  );
}
