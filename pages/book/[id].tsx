import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRResponse } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { Book as BookType } from '../../types/book';
import formatDate from '../../lib/formatDate';
import isAuthed from '../../lib/isAuthed';
import Chip from '../../components/elements/Chip';

export default function Book() {
  const { query } = useRouter();
  const { id } = query;
  const { data: book, error }: SWRResponse<BookType, Error> = useSWR(`/api/book/${id}`);
  const [shelf, setShelf] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!book) {
      return;
    }
    const mainShelf = book.shelves.find((s) => s.main);
    const newShelf = mainShelf && mainShelf.name ? mainShelf.name : '';
    const newTags = book.shelves.filter((s) => !s.main).map((t) => t.name);
    setShelf(newShelf);
    setTags(newTags);
  }, [book]);

  let shelfText = '';
  if (book.dateAdded) {
    shelfText = `${shelfText}added ${formatDate(book.dateAdded)}`;
  }
  if (book.dateUpdated) {
    shelfText = `${shelfText} ⋅ updated ${formatDate(book.dateUpdated)}`;
  }
  if (book.dateRead) {
    shelfText = `${shelfText} ⋅ read ${formatDate(book.dateRead)}`;
  }

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
      <section className="grid grid-cols-3">
        <div>
          <Image
            src={book.image}
            width={98}
            height={147}
            layout="fixed"
            className="rounded-l"
          />
        </div>
        <div className="col-span-2">
          <h1 className="mb-1 mt-2 text-2xl">{ book.title }</h1>
          <span>
            by
            {' '}
            { book.authors.map((a, i) => (
              <>
                <Link href={`/author/${a.id}`}>
                  <a>{`${a.name}${a.role ? ` (${a.role.toLowerCase()})` : ''}`}</a>
                </Link>
                { i < book.authors.length - 1 ? ', ' : '' }
              </>
            )) }
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
      <section
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: book.description }}
      />
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
    </>
  );
}

export const getServerSideProps = isAuthed();
