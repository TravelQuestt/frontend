import { fetchAllImages } from "@/lib/api/images";
import { useQuery } from "@tanstack/react-query";

export default function useImages(id?: number) {
  return useQuery({
    queryKey: ["images"],
    queryFn: () => fetchAllImages(id!),
    enabled: !!id,
  });
}
