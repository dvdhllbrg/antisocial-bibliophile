import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Book } from "@custom-types/book";
import useOnScreen from "@hooks/useOnScreen";

type BookCardProp = {
  book: Book;
  isVisible?: () => void;
  extra?: string;
  skeleton?: never;
};

type SkeletonBookCardProp = {
  skeleton: boolean;
  isVisible?: never;
  book?: never;
  extra?: never;
};

type BookCardProps = BookCardProp | SkeletonBookCardProp;

export default function BookCard({
  book,
  extra = "",
  skeleton = false,
  isVisible,
}: BookCardProps) {
  const loader = useRef<HTMLAnchorElement>(null);
  const loaderIsVisible = useOnScreen(loader);

  useEffect(() => {
    if (loaderIsVisible && isVisible) {
      isVisible();
    }
  }, [isVisible, loaderIsVisible]);

  if (skeleton) {
    return (
      <article className="flex bg-white dark:bg-gray-800 h-36 w-full rounded shadow mb-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-600 w-36" />
        <div className="w-full px-4">
          <div className="h-7 w-full mb-3 mt-2 bg-gray-200 dark:bg-gray-600 animate-pulse" />
          by
          <span className="inline-block ml-2 h-4 w-5/6 bg-gray-200 dark:bg-gray-600 animate-pulse" />
          {extra && (
            <span className="inline-block ml-2 h-4 w-1/2 bg-gray-200 dark:bg-gray-600 animate-pulse mt-2" />
          )}
        </div>
      </article>
    );
  }
  if (!book) {
    return <></>;
  }
  return (
    <article
      ref={loader}
      className="rounded overflow-y-hidden shadow mb-4 bg-white dark:bg-gray-800 hover:bg-gray-100"
    >
      <Link
        href={`/book/${book.id}`}
        key={book.id}
        className="flex no-underline font-normal"
      >
        <div className="-mb-2">
          <Image
            src={book.image || "/cover.png"}
            alt=""
            width={98}
            height={147}
            className="rounded-l object-cover"
          />
        </div>
        <div className="pl-4">
          <h2 className="mb-1 mt-2 text-lg font-semibold">{book.title}</h2>
          <span>
            by {book.authors?.map((a) => a.name).join(", ") || "unknown"}
          </span>
          <br />
          <span>{extra}</span>
        </div>
      </Link>
    </article>
  );
}
