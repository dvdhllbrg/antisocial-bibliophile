import { useRouter } from "next/router";
import TopAppBar from "@components/TopAppBar";

export default function Login() {
  const { query } = useRouter();

  const authenticateGoodreads = async () => {
    try {
      const res = await fetch("/api/auth/authenticate");
      const data = await res.json();
      if (query.redirectBookId) {
        sessionStorage.setItem(
          "redirectBookId",
          query.redirectBookId.toString()
        );
      }
      window.location.href = data.oAuthUrl;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TopAppBar title="Antisocial Bibliophile" />
      <main className="prose container mx-auto p-4">
        <p>
          To use all functions of this app, you need to login with a Goodreads
          account. When you click the button below, you will be directed to the
          Goodreads site to authenticate, and then be redirected back here.
        </p>
        <p>
          <b>Note:</b> Even though this app doesn&apos;t show any status updates
          anyhwere, actions you take will still generate them, and they will
          still be visible on the Goodreads site. Furthermore, Goodreads is very
          aggressive with sending friend requests whenever you sign up.{" "}
          There&apos;s not really a way to disable this (if you&apos;ve figured
          one out,{" "}
          <a
            href="https://twitter.com/dvdhllbrg"
            target="_blank"
            rel="noreferrer"
          >
            let me know
          </a>
          ), so just keep it in mind.
        </p>
        <button
          type="button"
          className="uppercase bg-primary dark:bg-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary font-semibold py-2 px-4 rounded w-full sm:w-auto"
          onClick={authenticateGoodreads}
        >
          Login with Goodreads
        </button>
      </main>
    </>
  );
}
