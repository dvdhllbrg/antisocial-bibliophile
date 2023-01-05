import { cookies } from "next/headers";
import { User } from "@custom-types/user";
import Chip from "@components/elements/Chip";
import NewShelfDrawer from "@components/NewShelfDrawer";
import TopAppBar from "@components/TopAppBar";
import Link from "next/link";

const getUser = async () => {
  const cookieHeader = cookies()
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const res = await fetch(`${process.env.APP_URL}/api/user`, {
    headers: {
      Cookie: cookieHeader,
    },
    next: {
      revalidate: 1800,
    },
  });
  return res.json() as Promise<User>;
};

const HomePage = async () => {
  const user = await getUser();

  if (!user.loggedIn) {
    return (
      <>
        <main className="prose dark:prose-light container mx-auto p-4">
          <section>
            <h2 className="mt-0 mb-2 text-2xl font-bold">
              Hey, it looks like you&apos;re not logged in!
            </h2>
            <p>
              That&apos;s fine, you can still use the app to search for and view
              books and authors. To get access to the full functionality (like
              managing your shelves and rating books), however, you need to{" "}
              <Link href="/auth/login">log in with a Goodreads account</Link>.
            </p>
          </section>
        </main>
      </>
    );
  }
  return (
    <>
      <TopAppBar title="My shelves" />
      <main className="container mx-auto p-4">
        <section>
          <h2 className="mt-0 mb-2 text-2xl font-bold">Main</h2>
          {user.shelves.map((shelf) => (
            <Link
              href={`/shelf/${shelf.name}`}
              key={shelf.id}
              className="flex border-b hover:bg-gray-300 dark:hover:bg-gray-600 no-underline font-normal justify-between p-4"
            >
              <span>{shelf.name}</span>
              <span>{shelf.count}</span>
            </Link>
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
          <NewShelfDrawer />
        </section>
      </main>
    </>
  );
};

export default HomePage;
