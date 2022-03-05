import { useEffect } from "react";

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

  return <p>Authorizing</p>;
}
