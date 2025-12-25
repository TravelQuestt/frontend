import { useQuery } from "@tanstack/react-query";
import { fetchAllAdventures } from "@/lib/api/adventures";

type UseMyAdventuresParams = {
  page: number;
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
}: UseMyAdventuresParams) {
  return useQuery({
    queryKey: [
      "my-adventures",
      page,
      searchTerm,
      filters.orderBy,
      filters.orderDirection,
    ],
    queryFn: () =>
      fetchAllAdventures({
        page,
        searchTerm,
        sortBy: filters.orderBy,
        order: filters.orderDirection,
      }),
    staleTime: 30_000,
  });
}
