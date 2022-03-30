import Head from "next/head";
import { useRouter } from "next/router";

// import StickyHeader from "~/components/StickyHeader";

import "~/styles/index.css";
import "~/styles/react-popper-tooltip.css";

import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { query } = useRouter();

  // if there's no lang, we're on the admin page; render it directly
  return query["lang"] ? (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="theme-color" content="#ffffff" />
        {/* <script async src="/fathom.js" /> */}
      </Head>
      {/* <Header /> */}
      <Component {...pageProps} />
    </>
  ) : (
    <Component {...pageProps} />
  );
};

export default MyApp;
