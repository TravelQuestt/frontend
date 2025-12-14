import { fetchStats } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export function getStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
}
