import useSWR from 'swr';
import { Book } from '@custom-types/book';

export default function useBook(id: string) {
  const { data, error, mutate } = useSWR<Book>(`/api/book/${id}`);

  return {
    book: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
