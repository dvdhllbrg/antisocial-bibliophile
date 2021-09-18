/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import '../styles/globals.css';
import BottomAppBar from '@components/BottomAppBar';

function MyApp({ Component, pageProps }: AppProps) {
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
        <title>Antisocial Bibliophile</title>

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
        <div className="bg-gray-50 min-h-screen">
          <Component {...pageProps} />
          <BottomAppBar />
        </div>
      </SWRConfig>
    </>
  );
}

export default MyApp;
