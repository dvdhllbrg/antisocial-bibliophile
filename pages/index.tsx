import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Chip from "@components/elements/Chip";
import TopAppBar from "@components/TopAppBar";
import NewShelfDrawer from "@components/NewShelfDrawer";
import Offline from "@components/Offline";
import SomethingWentWrong from "@components/SomethingWentWrong";
import useUser from "@hooks/swr/useUser";

export default function Home() {
  const { user, isError } = useUser();
  const [showNewShelfDrawer, setShowNewShelfDrawer] = useState(false);

  let content;

  if (isError) {
    console.log(isError);
    content = (
      <main className="container mx-auto p-4">
        {navigator.onLine ? <SomethingWentWrong /> : <Offline />}
      </main>
    );
  } else if (user && !user.loggedIn) {
    content = (
      <main className="prose dark:prose-light container mx-auto p-4">
        <section>
          <h2 className="mt-0 mb-2 text-2xl font-bold">
            Hey, it looks like you&apos;re not logged in!
          </h2>
          <p>
            That&apos;s fine, you can still use the app to search for and view
            books and authors. To get access to the full functionality (like
            managing your shelves and rating books), however, you need to{" "}
            <Link href="/auth/login">
              log in with a Goodreads account
            </Link>
            .
          </p>
        </section>
      </main>
    );
  } else if (user && user.loggedIn) {
    content = (
      <>
        <main className="container mx-auto p-4">
          <section>
            <h2 className="mt-0 mb-2 text-2xl font-bold">Main</h2>
            {user.shelves.map((shelf) => (
              (<Link
                href={`/shelf/${shelf.name}`}
                key={shelf.id}
                className="flex border-b hover:bg-gray-300 dark:hover:bg-gray-600 no-underline font-normal justify-between p-4">

                <span>{shelf.name}</span>
                <span>{shelf.count}</span>

              </Link>)
            ))}
          </section>
          <section>
            <h2 className="mt-6 mb-4 text-2xl font-bold">Tags</h2>
            {user.tags?.map((tag) => (
              <Chip
                key={tag.id}
                href={`/shelf/${tag.name}`}
                label={`${tag.name} (${tag.count})`}
                size="large"
              />
            ))}
          </section>
          <section className="mt-6">
            <button
              type="button"
              className="w-full border py-2 text-sm border-gray-800 dark:border-white uppercase"
              onClick={() => setShowNewShelfDrawer(true)}
            >
              Create a new tag or shelf
            </button>
          </section>
        </main>
        <NewShelfDrawer
          show={showNewShelfDrawer}
          onDrawerClose={() => setShowNewShelfDrawer(false)}
        />
      </>
    );
  } else {
    content = (
      <>
        <main className="container mx-auto p-4">
          <section>
            <h2 className="mt-0 mb-2 text-2xl font-bold">Main</h2>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-12 w-full mb-4" />
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 border-dark-primaryh-12 w-full mb-4" />
            <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-12 w-full mb-4" />
          </section>
          <section>
            <h2 className="mt-6 mb-4 text-2xl font-bold">Tags</h2>
            <Chip skeleton size="large" />
            <Chip skeleton size="large" />
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/api/user"
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title="My shelves" />
      {content}
    </>
  );
}
