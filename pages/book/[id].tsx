import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/solid';
import formatDate from '@lib/formatDate';
import formatNumber from '@lib/formatNumber';
import isAuthed from '@lib/isAuthed';
import TopAppBar from '@components/TopAppBar';
import BookShelfDrawer from '@components/BookShelfDrawer';
import Chip from '@components/elements/Chip';
import Rating from '@components/Rating';
import useBook from '@hooks/swr/useBook';
import useReview from '@hooks/swr/useReview';
import { GetStaticProps } from 'next';
import { get } from '@lib/goodreads';
import bookReducer from '@reducers/bookReducer';
import reviewReducer from '@reducers/reviewReducer';

export default function Book({ id, initialData }) {
  console.log(id);
  const { book, isError: bookError } = useBook(id as string);
  const { review, mutate } = useReview(id as string);

  const [shelfText, setShelfText] = useState('');
  const [showBookshelfDrawer, setShowBookshelfDrawer] = useState(false);

  useEffect(() => {
    if (!review) {
      return;
    }

    let text = '';
    if (review.dateAdded) {
      text = `${text}added ${formatDate(review.dateAdded)}`;
    }
    if (review.dateUpdated) {
      text = `${text} ⋅ updated ${formatDate(review.dateUpdated)}`;
    }
    if (review.dateRead) {
      text = `${text} ⋅ read ${formatDate(review.dateRead)}`;
    }

    setShelfText(text);
  }, [review]);

  const rateBook = (rating: number) => {
    if (!review) {
      return;
    }
    mutate({
      ...review,
      myRating: rating,
    }, false);

    fetch(`/api/review/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ rating }),
    });
  };

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

  if (bookError) {
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
                onClick={() => setShowBookshelfDrawer(true)}
              >
                <PencilIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-2">
              {review?.shelf ? <Chip className="bg-gray-400" label={review?.shelf.name} href={`/shelf/${review?.shelf.name}`} /> : 'Not on your shelves.'}
              {review?.tags!
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    href={`/shelf/${tag.name}`}
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
            rating={review?.myRating || 0}
            textUnder="Tap a star to give a rating."
            onRate={rateBook}
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
      <BookShelfDrawer
        show={showBookshelfDrawer}
        bookId={id as string}
        onDrawerClose={() => setShowBookshelfDrawer(false)}
      />
    </>
  );
}

export const getStaticPaths = async () => ({ paths: [], fallback: true });

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let initialData = {};
  try {
    const { book } = await get(`/book/show/${params?.id}.xml}`);
    initialData = bookReducer(book);
  } catch (err) {
    console.error(err);
  }
  return {
    props: {
      id: params?.id,
      initialData,
    },
    revalidate: 60,
  };
};
