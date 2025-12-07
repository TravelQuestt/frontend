import { fetchUser } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";

export function getUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
}
