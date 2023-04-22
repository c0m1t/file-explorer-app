import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/Toaster";
import AppProviders, { AppProps } from "@/lib/Providers";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: "swap",
});

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppProviders {...props}>
      <style global jsx>{`
        :root {
          --font-inter: ${interFont.style.fontFamily};
        }
      `}</style>

      {getLayout(<Component {...pageProps} />)}
      <Toaster />
    </AppProviders>
  );
}
