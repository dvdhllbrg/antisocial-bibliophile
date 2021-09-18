import Head from 'next/head';
import TopAppBar from '@components/TopAppBar';
import Offline from '@components/Offline';

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Antisocial Bibliophile - Offline</title>
      </Head>
      <TopAppBar title="Antisocial Bibliophile" />
      <Offline />
    </>
  );
}
