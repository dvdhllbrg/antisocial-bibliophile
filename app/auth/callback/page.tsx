"use client";

import { useEffect } from "react";
import Image from "next/image";
import TopAppBar from "@components/TopAppBar";
import login from "@images/login.svg";

export default function AuthCallback() {
  useEffect(() => {
    async function authorizeGoodreads() {
      try {
        await fetch("/api/auth/authorize");
        const redirectBookId = sessionStorage.getItem("redirectBookId");
        if (redirectBookId) {
          sessionStorage.removeItem("redirectBookId");
          window.location.href = `/book/${redirectBookId}`;
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        console.error(err);
      }
    }
    authorizeGoodreads();
  }, []);

  return (
    <>
      <TopAppBar title="Antisocial Bibliophile" />
      <main className="prose dark:prose-light container mx-auto p-4">
        <div className="mb-3">
          <Image src={login} alt="" className="max-w-full" priority />
        </div>
        <h1>Authorizing ...</h1>
      </main>
    </>
  );
}
