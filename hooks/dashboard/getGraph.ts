import { fetchGraphStats } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export function getGraph() {
    return useQuery({
        queryKey: ["graph"],
        queryFn: fetchGraphStats,
    });
}
