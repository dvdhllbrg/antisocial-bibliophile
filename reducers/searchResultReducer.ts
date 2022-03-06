import { Book } from "@custom-types/book";
import authorReducer, { AuthorPropType } from "@reducers/authorReducer";

type SearchResultPropType = {
  best_book: {
    id: string | { _: string };
    title: string;
    image_url: string;
    author: AuthorPropType;
  };
};

export default function userReducer(searchResult: SearchResultPropType): Book {
  return {
    id:
      typeof searchResult.best_book.id === "object"
        ? searchResult.best_book.id._
        : searchResult?.best_book.id || "",
    title: searchResult?.best_book?.title || "",
    image: searchResult?.best_book?.image_url || "",
    authors: [authorReducer(searchResult?.best_book?.author)],
  };
}
