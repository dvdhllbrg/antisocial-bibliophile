import { useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import { Author } from "@custom-types/author";
import TopAppBar from "@components/TopAppBar";
import BookList from "@components/BookList";
import Offline from "@components/Offline";
import Modal from "@components/Modal";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { get } from "@lib/goodreads";
import authorReducer from "@reducers/authorReducer";

const PER_PAGE = 10;

type AuthorPageProps = {
  id: string;
  fallbackData: Author;
};

export default function AuthorPage({ id, fallbackData }: AuthorPageProps) {
  const { data: author, error } = useSWR<Author>(`/api/author/${id}`, {
    fallbackData,
  });

  const [showImageModal, setShowImageModal] = useState(false);

  let authorContent;

  if (error) {
    authorContent = navigator.onLine ? <SomethingWentWrong /> : <Offline />;
  } else if (!author) {
    authorContent = (
      <div className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
    );
  } else {
    authorContent = (
      <article>
        <div className="float-left mr-4">
          <button onClick={() => setShowImageModal(true)}>
            <div>
              <Image
                alt=""
                src={author.image}
                width={127}
                height={177}
                className="object-cover"
              />
            </div>
          </button>
          {showImageModal && (
            <Modal onClose={() => setShowImageModal(false)}>
              <Image
                alt=""
                src={author.image}
                width={294}
                height={441}
                className="rounded-l"
              />
            </Modal>
          )}
        </div>
        <div
          className="prose dark:prose-light"
          dangerouslySetInnerHTML={{ __html: author.description }}
        />
      </article>
    );
  }
  const pageTitle = `${author && author.name} | Antisocial Bibliophile`;
  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
        <link
          rel="preload"
          href={`/api/author/${id}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={author?.name || "Loading author..."} />
      <main className="container mx-auto p-4">
        {authorContent}
        <section className="mt-4 clear-both max-w-screen-lg">
          <h2 className="mb-1 mt-2 text-xl">Books</h2>
          <BookList
            showErrors={false}
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
      revalidate: 60,
    };
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }
};
