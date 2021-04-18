import useSWR from 'swr';
import { User } from '@custom-types/user';

export default function useMe() {
  const { data, error, mutate } = useSWR<User>('/api/me');

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
