import Image from "next/image";
import signalSearching from "@images/signal-searching.svg";

export default function Offline() {
  return (
    <div className="prose dark:prose-light">
      <div className="mb-3">
        <Image src={signalSearching} alt="" />
      </div>
      <h1>You&apos;re offline!</h1>
      <p>
        Oops, it looks like you&apos;re offline, and we haven&apos;t had the
        opportunity to cache that thing you&apos;re looking for yet. Try again
        when you have connectivity! Why not take the opportunity to read a book
        in the meantime?
      </p>
    </div>
  );
}
