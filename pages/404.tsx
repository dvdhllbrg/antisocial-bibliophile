import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@components/TopAppBar";
import lost from "@images/lost.svg";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <TopAppBar title="Antisocial Bibliophile" />
      <main className="prose dark:prose-light container mx-auto p-4">
        <div className="mb-3">
          <Image src={lost} alt="" className="max-w-full" priority />
        </div>
        <h1>Not found!</h1>
        <p>
          Uh-oh, looks like we couldn&apos;t find whatever you were looking for.
          Do you want to try{" "}
          <Link href="/">going to back to see your shelves</Link>?
        </p>
      </main>
    </>
  );
}
