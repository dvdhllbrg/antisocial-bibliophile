import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import useSWR from 'swr';
import { Author } from '@custom-types/author';
import TopAppBar from '@components/TopAppBar';
import BookList from '@components/BookList';
import Offline from '@components/Offline';
import SomethingWentWrong from '@components/SomethingWentWrong';
import { get } from '@lib/goodreads';
import authorReducer from '@reducers/authorReducer';

const PER_PAGE = 10;

type AuthorPageProps = {
  id: string;
  fallbackData: Author;
};

export default function AuthorPage({ id, fallbackData }: AuthorPageProps) {
  if (!id) {
    return null;
  }

  const { data: author, error } = useSWR<Author>(`/api/author/${id}`, { fallbackData });

  let authorContent: {};

  if (error) {
    authorContent = <p>We could not get that author.</p>;
    authorContent = navigator.onLine ? <SomethingWentWrong /> : <Offline />;
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
            params={{
              per_page: PER_PAGE,
            }}
          />
        </section>
      </main>
    </>
  );
}

export const getStaticPaths = async () => ({ paths: [], fallback: true });

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true };
  }
  try {
    const { author } = await get(`/author/show/${params.id}`);
    return {
      props: {
        id: params.id,
        fallbackData: authorReducer(author),
      },
      revalidate: 1,
    };
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }
};
