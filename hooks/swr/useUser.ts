import useSWR from "swr";
import { User } from "@custom-types/user";

export default function useUser() {
  const { data: user, error, mutate } = useSWR<User>("/api/user");

  return {
    user,
    isLoading: !error && !user,
    isError: error,
    mutate,
  };
}
