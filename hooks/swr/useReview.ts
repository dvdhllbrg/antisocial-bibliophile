import useSWR from "swr";
import { Review } from "@custom-types/review";

export default function useReview(id: string) {
  const { data, error, mutate } = useSWR<Review>(`/api/book/${id}/review`);

  return {
    review: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
