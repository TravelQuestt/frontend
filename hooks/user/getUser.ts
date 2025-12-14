import { fetchUser } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";

type UseUserOptions = {
  enabled?: boolean;
};

export function getUser(options?: UseUserOptions) {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: options?.enabled ?? true,
  });
}
