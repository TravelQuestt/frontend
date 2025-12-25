import { useQuery } from "@tanstack/react-query";
import { fetchAdventure } from "@/lib/api/adventures";

export default function useAdventure(id?: number) {
  return useQuery({
    queryKey: ["adventure", id],
    queryFn: () => fetchAdventure(id!),
    enabled: !!id,
  });
}
