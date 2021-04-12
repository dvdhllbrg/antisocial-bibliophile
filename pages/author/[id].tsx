import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR, { useSWRInfinite } from 'swr';
import Image from 'next/image';
import { Author as AuthorType } from '@custom-types/author';
import { Book } from '@custom-types/book';
import TopAppBar from '@components/TopAppBar';
import BookCard from '@components/elements/BookCard';
import useOnScreen from '@hooks/useOnScreen';

const PAGE_SIZE = 20;

const getKey = (pageIndex: number, previousPageData: Book[] | null, params: any) => {
  if (previousPageData && !previousPageData.length) {
    return null;
  }
  const {
    id, pageSize,
  } = params;
  return `/api/author/${id}/books?page=${pageIndex + 1}&per_page=${pageSize}`;
};

export default function Author() {
  const { query } = useRouter();
  const { id } = query;
  const loader = useRef(null);
  const loaderIsVisible = useOnScreen(loader);

  const { data: author, error: authorError } = useSWR<AuthorType>(`/api/author/${id}`);
  const {
    data: authorBooks, error: booksError, size, setSize, isValidating,
  } = useSWRInfinite<Book[]>(
    (...args) => getKey(...args, {
      id,
      pageSize: PAGE_SIZE,
    }),
  );

  const books = authorBooks ? ([] as Book[]).concat(...authorBooks) : [];
  const isLoadingInitialData = !authorBooks && !booksError;
  const isLoadingMore = (size > 0 && authorBooks && typeof authorBooks[size - 1] === 'undefined');
  const isEmpty = authorBooks?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (authorBooks && authorBooks[authorBooks.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && authorBooks && authorBooks.length === size;

  useEffect(() => {
    if (loaderIsVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1);
    }
  }, [loaderIsVisible, isRefreshing]);

  let authorBooksContent: {};
  let authorContent: {};

  if (authorError || booksError) {
    return <div>failed to load</div>;
  }

  if (!author) {
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

  if (!isLoadingInitialData) {
    authorBooksContent = (
      <>
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
      </>
    );
  } else {
    authorBooksContent = books.map((book) => (
      <BookCard
        key={book.id}
        book={book}
      />
    ));
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/author/${id}/books?page=1&per_page=${PAGE_SIZE}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={author?.name || 'Loading ...'} />
      <main className="container mx-auto p-4">
        { authorContent }
        <section className="mt-4 clear-both">
          <h2 className="mb-1 mt-2 text-xl">Books</h2>
          <div className="max-w-screen-lg">
            { authorBooksContent }
            <div ref={loader}>
              {isLoadingMore && (
                <div className="flex flex-col justify-center items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
                  Loading more
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
