import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return function logout() {
    deleteCookie("auth_token")
    queryClient.clear();
    router.replace("/login");
  };
}