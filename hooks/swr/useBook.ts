import useSWR from "swr";
import { Book } from "@custom-types/book";

export default function useBook(id: string, fallbackData?: Book) {
  const { data, error, mutate } = useSWR<Book>(`/api/book/${id}`, {
    fallbackData,
  });

  return {
    book: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
