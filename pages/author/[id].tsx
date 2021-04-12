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

const PAGE_SIZE = 10;

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
  const isLoadingInitialBooks = !authorBooks && !booksError;
  const isLoadingMoreBooks = (size > 0 && authorBooks && typeof authorBooks[size - 1] === 'undefined');
  const booksAreEmpty = authorBooks?.[0]?.length === 0;
  const isReachingEndOfBooks = booksAreEmpty || (authorBooks && authorBooks[authorBooks.length - 1]?.length < PAGE_SIZE);
  const isRefreshingBooks = isValidating && authorBooks && authorBooks.length === size;

  useEffect(() => {
    if (loaderIsVisible && !isReachingEndOfBooks && !isRefreshingBooks) {
      setSize(size + 1);
    }
  }, [loaderIsVisible, isRefreshingBooks]);

  let authorBooksContent: {};
  let authorContent: {};

  if (authorError) {
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

  if (booksError) {
    authorBooksContent = <p>We could not get those books.</p>;
  } else if (isLoadingInitialBooks) {
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
        <section className="mt-4 clear-both max-w-screen-lg">
          <h2 className="mb-1 mt-2 text-xl">Books</h2>
          { authorBooksContent }
          <div ref={loader}>
            {isLoadingMoreBooks && (
              <div className="flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
                Loading more
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
