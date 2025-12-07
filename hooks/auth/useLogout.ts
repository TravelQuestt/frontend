import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return function logout() {
    deleteCookie("auth_token")
    queryClient.clear();
    router.replace("/login");
    toast.success("Logout Successful!")
  };
}