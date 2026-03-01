import { fetchTrip } from "@/lib/api/trips";
import { useQuery } from "@tanstack/react-query";

export default function useTrip(id?: number) {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: () => fetchTrip(id!),
    enabled: !!id,
  });
}
