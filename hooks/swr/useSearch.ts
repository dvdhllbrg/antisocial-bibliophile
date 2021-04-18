import useSWR from 'swr';
import useDebounce from '@hooks/useDebounce';
import { Book } from '@custom-types/book';

type SearchOptions = {
  limit?: number;
  debounce?: number;
};

export default function useSearch(searchTerm: string | null, options?: SearchOptions) {
  const debouncedSearchTerm = useDebounce(searchTerm, options?.debounce || 250);

  const { data, error, isValidating } = useSWR<Book[]>(
    debouncedSearchTerm !== ''
      ? `/api/search?query=${debouncedSearchTerm}&limit=${options?.limit || 5}`
      : null,
  );

  return {
    results: data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
  };
}
