import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR, { SWRResponse } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
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

  if (error) {
    return <div>failed to load</div>;
  }
  if (!book) {
    return (
      <>
        loading
      </>
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
      <TopAppBar title={book.title} />
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
            <span>
              by
              {' '}
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
            <b>Shelves</b>
            <div>
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
        <section className="flex items-center justify-evenly w-full">
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
        <section>
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
    </>
  );
}

export const getServerSideProps = isAuthed();
