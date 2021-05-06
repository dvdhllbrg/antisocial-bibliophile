import useSWR from 'swr';
import { User } from '@custom-types/user';

export default function useUser() {
  const { data, error, mutate } = useSWR<User>('/api/user');

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
