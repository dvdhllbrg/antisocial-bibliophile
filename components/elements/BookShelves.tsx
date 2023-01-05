import Link from "next/link";
import { Review } from "@custom-types/review";
import Chip from "./Chip";
import formatDate from "@lib/formatDate";
import BookShelfDrawer from "@components/BookShelfDrawer";
import { cookies } from "next/headers";
import { User } from "@custom-types/user";

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

const getShelfText = (review: Review) => {
  let text = "";
  if (review.dateAdded) {
    text = `${text}added ${formatDate(review.dateAdded)}`;
  }
  if (review.dateUpdated) {
    text = `${text} ⋅ updated ${formatDate(review.dateUpdated)}`;
  }
  if (review.dateRead) {
    text = `${text} ⋅ read ${formatDate(review.dateRead)}`;
  }
  return text;
};

type BookShelvesProps = {
  review?: Review;
  bookId: string;
};

const BookShelves = async ({ review, bookId }: BookShelvesProps) => {
  const user = await getUser();

  let shelfText = "";
  let shelvesContent = (
    <small className="italic">
      To see your shelf status for this book,{" "}
      <Link href={`/auth/login?redirectBookId=${bookId}`}>
        login to your Goodreads account
      </Link>
      .
    </small>
  );
  if (review) {
    shelfText = getShelfText(review);
    shelvesContent = (
      <>
        {review.shelf ? (
          <Chip
            className="bg-gray-400"
            label={review.shelf.name}
            href={`/shelf/${review.shelf.name}`}
          />
        ) : (
          "Not on your shelves."
        )}
        {review
          .tags!.sort((a, b) => a.name.localeCompare(b.name))
          .map((tag) => (
            <Chip key={tag.id} label={tag.name} href={`/shelf/${tag.name}`} />
          ))}
      </>
    );
  }

  return (
    <>
      <div className="flex mt-2 mb-1">
        <b>Shelves</b>
        {user.loggedIn && review && (
          <BookShelfDrawer bookId={bookId} user={user} review={review} />
        )}
      </div>
      <div className="mb-2">{shelvesContent}</div>
      <small>{shelfText}</small>
    </>
  );
};

export default BookShelves;
