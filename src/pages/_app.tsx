import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LiffProvider } from "@/hooks/LiffProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID || ""}>
      <Component {...pageProps} />;
    </LiffProvider>
  );
}
