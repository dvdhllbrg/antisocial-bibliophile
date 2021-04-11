/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import BottomAppBar from '@components/BottomAppBar';

function MyApp({ Component, pageProps }: AppProps) {
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
          href="/favicon.ico"
          rel="icon"
          type="image/png"
          sizes="48x48"
        />
        <link rel="apple-touch-icon" href="/icons/logo192.png" />
        <meta name="theme-color" content="#4db6ac" />
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <Component {...pageProps} />
        <BottomAppBar />
      </div>
    </>
  );
}

export default MyApp;
