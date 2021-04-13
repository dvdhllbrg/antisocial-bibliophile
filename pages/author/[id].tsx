import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import Image from 'next/image';
import { Author as AuthorType } from '@custom-types/author';
import useOnScreen from '@hooks/useOnScreen';
import TopAppBar from '@components/TopAppBar';
import BookList from '@components/BookList';

const PAGE_SIZE = 10;

export default function Author() {
  const { query } = useRouter();
  const { id } = query;
  const loader = useRef(null);
  const loaderIsVisible = useOnScreen(loader);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(1);

  const { data: author, error } = useSWR<AuthorType>(`/api/author/${id}`);

  useEffect(() => {
    if (loaderIsVisible && !isLoading) {
      setPages(pages + 1);
      setIsLoading(true);
    }
  }, [loaderIsVisible]);

  let authorContent: {};

  if (error) {
    authorContent = <p>We could not get that author.</p>;
  } else if (!author) {
    authorContent = (
      <div className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
    );
  } else {
    authorContent = (
      <section>
        <div className="float-left mr-4">
          <Image
            src={author.image}
            width={127}
            height={177}
            layout="fixed"
            className="object-cover"
          />
        </div>
        <div
          className="prose"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: author.description }}
        />
      </section>
    );
  }

  const books = [];
  for (let i = 0; i < pages; i += 1) {
    books.push(
      <BookList
        key={i}
        index={i + 1}
        route={`/api/author/${id}/books?page=${i + 1}&per_page=${PAGE_SIZE}`}
        onLoaded={() => setIsLoading(false)}
      />,
    );
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/author/${id}`}
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`/api/author/${id}/books?page=1&per_page=${PAGE_SIZE}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={author?.name || 'Loading...'} />
      <main className="container mx-auto p-4">
        { authorContent }
        <section className="mt-4 clear-both max-w-screen-lg">
          <h2 className="mb-1 mt-2 text-xl">Books</h2>
          { books }
          <div
            ref={loader}
            className="w-full h-12"
          />
        </section>
      </main>
    </>
  );
}
