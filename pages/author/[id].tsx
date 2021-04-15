import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import Image from 'next/image';
import { Author as AuthorType } from '@custom-types/author';
import TopAppBar from '@components/TopAppBar';
import BookList from '@components/BookList';

const PER_PAGE = 10;

export default function Author() {
  const { query } = useRouter();
  const { id } = query;

  const { data: author, error } = useSWR<AuthorType>(`/api/author/${id}`);

  let authorContent: {};

  if (error) {
    authorContent = <p>We could not get that author.</p>;
  } else if (!author) {
    authorContent = (
      <div className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
    );
  } else {
    authorContent = (
      <article>
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
      </article>
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
      </Head>
      <TopAppBar title={author?.name || 'Loading author...'} />
      <main className="container mx-auto p-4">
        { authorContent }
        <section className="mt-4 clear-both max-w-screen-lg">
          <h2 className="mb-1 mt-2 text-xl">Books</h2>
          <BookList
            baseRoute={`/api/author/${id}/books`}
            perPage={PER_PAGE}
          />
        </section>
      </main>
    </>
  );
}
