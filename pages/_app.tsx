import "@/styles/globals.css";
import { AppProps } from "next/app";
import AppProviders from "@/lib/Providers";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AppProviders {...props}>
      <Component {...pageProps} />
    </AppProviders>
  );
}
