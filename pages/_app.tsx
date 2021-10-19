/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { ThemeProvider } from 'next-themes';
import { get } from 'idb-keyval/dist/index';
import '../styles/globals.css';
import BottomAppBar from '@components/BottomAppBar';

function MyApp({ Component, pageProps }: AppProps) {
  const [includeAnalytics, setIncludeAnalytics] = useState(true);

  useEffect(() => {
    const getSettings = async () => {
      const disableAnalytics = get('disableAnalytics');
      setIncludeAnalytics(!disableAnalytics);
    };
    getSettings();
  }, []);

  const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // error.info = await res.json();
      // error.status = res.status;
      throw error;
    }

    return res.json();
  };

  const swrOptions = {
    fetcher,
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="description"
          content="Goodreads but without all the stuff that make Goodreads special."
        />
        <title key="title">Antisocial Bibliophile</title>
        {includeAnalytics && <script
          async
          defer
          data-website-id="fb737107-35b4-41f2-9143-6a4255ce0cee"
          data-do-not-track="true"
          data-domains="antisocial-bibliophile.vercel.app"
          src="https://umami-five-cyan.vercel.app/umami.js"
        />}

        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta
          name="msapplication-TileColor"
          content="#4db6ac"
        />
        <meta
          name="theme-color"
          content="#4db6ac"
          />
      </Head>
      <SWRConfig value={swrOptions}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
        >
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Component {...pageProps} />
            <BottomAppBar />
          </div>
        </ThemeProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
