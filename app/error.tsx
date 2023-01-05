"use client";

import Offline from "@components/Offline";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { useEffect } from "react";

type Props = {
  error: Error;
  reset: () => void;
};
const Error = ({ error, reset }: Props) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto p-4">
      {navigator.onLine ? <SomethingWentWrong /> : <Offline />}
    </main>
  );
};

export default Error;
