import { useQuery } from "@tanstack/react-query";
import { fetchAllAdventures } from "@/lib/api/adventures";

type UseMyAdventuresParams = {
  page: number;
  size: number;
  searchTerm: string;
  filters: {
    orderBy: string;
    orderDirection: string;
  };
};

export default function useAdventures({
  page,
  searchTerm,
  filters,
  size,
}: UseMyAdventuresParams) {
  return useQuery({
    queryKey: [
      "adventures",
      page,
      size,
      searchTerm,
      filters.orderBy,
      filters.orderDirection,
    ],
    queryFn: () =>
      fetchAllAdventures({
        page,
        searchTerm,
        size,
        sortBy: filters.orderBy,
        order: filters.orderDirection,
      }),
    staleTime: 30_000,
  });
}
