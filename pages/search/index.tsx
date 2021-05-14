import { useRouter } from 'next/router';
import Head from 'next/head';
import TopAppBar from '@components/TopAppBar';
import BookList from '@components/BookList';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/search?page=1&query=${query}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={`Search results for "${query}"`} />
      <main className="container mx-auto p-4 transform-gpu transition-all duration-200 ease-out">
        <BookList
          baseRoute="/api/search"
          params={{
            query,
          }}
        />
      </main>
    </>
  );
}
