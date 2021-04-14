import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR, { SWRResponse } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/solid';
import { Book as BookType } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import formatNumber from '@lib/formatNumber';
import isAuthed from '@lib/isAuthed';
import TopAppBar from '@components/TopAppBar';
import Chip from '@components/elements/Chip';
import Rating from '@components/Rating';

export default function Book() {
  const { query } = useRouter();
  const { id } = query;
  const { data: book, error }: SWRResponse<BookType, Error> = useSWR(`/api/book/${id}`);
  const [shelf, setShelf] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [shelfText, setShelfText] = useState('');
  useEffect(() => {
    if (!book || !book.shelves) {
      return;
    }
    const mainShelf = book.shelves.find((s) => s.main);
    const newShelf = mainShelf && mainShelf.name ? mainShelf.name : '';
    const newTags = book.shelves.filter((s) => !s.main).map((t) => t.name);
    setShelf(newShelf);
    setTags(newTags);

    let text = '';
    if (book.dateAdded) {
      text = `${text}added ${formatDate(book.dateAdded)}`;
    }
    if (book.dateUpdated) {
      text = `${text} ⋅ updated ${formatDate(book.dateUpdated)}`;
    }
    if (book.dateRead) {
      text = `${text} ⋅ read ${formatDate(book.dateRead)}`;
    }

    setShelfText(text);
  }, [book]);

  let content = (
    <main className="container mx-auto p-4 pb-24">
      <section className="grid grid-cols-3">
        <div className="h-36 w-24 mb-3 mt-2 bg-gray-200 animate-pulse" />
        <div className="col-span-2">
          <div className="animate-pulse bg-gray-200 h-7 w-48" />
          <b>Shelves</b>
          <div className="mb-2">
            <Chip skeleton />
            <Chip skeleton />
          </div>
          <span className="inline-block ml-2 h-4 w-full bg-gray-200 animate-pulse mt-2" />
        </div>
      </section>
      <section className="flex items-center justify-evenly w-full my-6">
        <div className="h-20 w-1/3 mb-3 mt-2 bg-gray-200 animate-pulse" />
        <div className="h-20 w-1/3 mb-3 mt-2 bg-gray-200 animate-pulse" />
      </section>
      <section className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
      <section className="mt-6 h-4 w-1/2 bg-gray-200 animate-pulse" />
    </main>
  );

  if (error) {
    content = <div>failed to load</div>;
  } else if (book) {
    content = (
      <main className="container mx-auto p-4 pb-24">
        <section className="grid grid-cols-3">
          <div>
            <Image
              src={book.image || '/cover.png'}
              width={98}
              height={147}
              layout="fixed"
              className="rounded-l"
            />
          </div>
          <div className="col-span-2">
            <span className="text-xl">
              { book.authors?.map((a, i) => (
                <span key={a.id}>
                  <Link href={`/author/${a.id}`}>
                    <a>{`${a.name}${a.role ? ` (${a.role.toLowerCase()})` : ''}`}</a>
                  </Link>
                  { i < (book.authors?.length || 0) - 1 ? ', ' : '' }
                </span>
              )) || 'unknown'}
            </span>
            <br />
            <div className="flex mt-2 mb-1">
              <b>Shelves</b>
              <button
                type="button"
              >
                <PencilIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-2">
              {shelf ? <Chip className="bg-gray-400" label={shelf} href={`/shelf/${shelf}`} /> : 'Not on your shelves.'}
              {tags && tags
                .sort((a, b) => a.localeCompare(b))
                .map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    href={`/shelf/${tag}`}
                  />
                ))}
            </div>
            <small>{ shelfText }</small>
          </div>
        </section>
        <section className="flex items-center justify-evenly w-full my-6">
          <Rating
            textOver="Goodreads rating"
            rating={book.rating || 0}
            textUnder={`${formatNumber(book.rating || 0)} from ${formatNumber(book.numberOfRatings || 0)} ratings.`}
          />
          <Rating
            textOver="Your rating"
            rating={book.myRating || 0}
            textUnder="Tap a star to give a rating."
          />
        </section>
        <section
          className="mt-4 prose"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: book.description || '' }}
        />
        <section className="mt-6">
          <small>
            { book.pages }
            {' '}
            pages ⋅
            {' '}
            first published in
            {' '}
            { book.year || 'an unknown year' }
            {' ⋅ '}
            ISBN
            {' '}
            { book.isbn }
            {' ⋅ '}
            <a href={book.url}>Open on Goodreads</a>
          </small>
        </section>
      </main>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/book/${id}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={book?.title || 'Loading book...'} />
      { content }
    </>
  );
}

export const getServerSideProps = isAuthed();
