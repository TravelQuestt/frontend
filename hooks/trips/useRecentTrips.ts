import { fetchAllTrips } from "@/lib/api/trips";
import { useQuery } from "@tanstack/react-query";

type UseMyTripsParams = {
  page: number;
  size: number;
  searchTerm: string;
  filters: {
    orderBy: string;
    orderDirection: string;
  };
};

export default function useRecentTrips({
  page,
  searchTerm,
  filters,
  size,
}: UseMyTripsParams) {
  return useQuery({
    queryKey: [
      "recent-trips",
      size,
      page,
      searchTerm,
      filters.orderBy,
      filters.orderDirection,
    ],
    queryFn: () =>
      fetchAllTrips({
        page,
        size,
        searchTerm,
        sortBy: filters.orderBy,
        order: filters.orderDirection,
      }),
    staleTime: 30_000,
  });
}
