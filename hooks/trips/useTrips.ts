import { fetchAllTrips } from "@/lib/api/trips";
import { useQuery } from "@tanstack/react-query";

type UseMyTripsParams = {
  page: number;
  size: number;
  searchTerm: string;
  filters: {
    status: string;
    orderBy: string;
    orderDirection: string;
  };
};

export default function useTrips({
  page,
  searchTerm,
  filters,
  size,
}: UseMyTripsParams) {
  return useQuery({
    queryKey: [
      "trips",
      page,
      size,
      searchTerm,
      filters.orderBy,
      filters.status,
      filters.orderDirection,
    ],
    queryFn: () =>
      fetchAllTrips({
        page,
        searchTerm,
        size,
        sortBy: filters.orderBy,
        order: filters.orderDirection,
        status: filters.status,
      }),
    staleTime: 30_000,
  });
}
