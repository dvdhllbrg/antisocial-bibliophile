import useSWR from 'swr';
import { Book } from '@custom-types/book';

export default function useBook(id: string, initialData?: Book) {
  const { data, error, mutate } = useSWR<Book>(`/api/book/${id}`, { initialData });

  return {
    book: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
