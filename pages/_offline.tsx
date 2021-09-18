import Head from 'next/head';
import Image from 'next/image';
import TopAppBar from '@components/TopAppBar';
import signalSearching from '@images/signal-searching.svg';

export default function Offline() {
  return (
    <>
      <Head>
        <title>Antisocial Bibliophile - Offline</title>
      </Head>
      <TopAppBar title="Antisocial Bibliophile" />
      <main className="prose container mx-auto p-4">
        <div className="mb-3">
          <Image
            src={signalSearching}
            alt=""
          />
        </div>
        <h1>You're offline!</h1>
        <p>
          Oops, it looks like you're offline, and we haven't had the opportunity to cache that thing you're looking for yet. Try again when you have connectivity! Why not take the opportunity to read a book in the meantime?
        </p>
      </main>
    </>
  );
}
