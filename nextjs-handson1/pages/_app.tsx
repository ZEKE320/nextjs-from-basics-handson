import "@/styles/globals.scss";
import { Noto_Sans_JP } from "next/font/google";
import type { AppProps } from "next/app";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={notoSansJP.className}>
      <Component {...pageProps} />
    </main>
  );
}
