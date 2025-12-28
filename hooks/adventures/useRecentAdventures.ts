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

export default function useRecentAdventures({
  page,
  searchTerm,
  filters,
  size
}: UseMyAdventuresParams) {
  return useQuery({
    queryKey: [
      "recent-adventures",
      size,
      page,
      searchTerm,
      filters.orderBy,
      filters.orderDirection,
    ],
    queryFn: () =>
      fetchAllAdventures({
        page,
        size,
        searchTerm,
        sortBy: filters.orderBy,
        order: filters.orderDirection,
      }),
    staleTime: 30_000,
  });
}
