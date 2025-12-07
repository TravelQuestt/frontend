import { login } from "@/lib/api/auth";
import { fetchUser } from "@/lib/api/user";
import { LoginPayload } from "@/types/LoginPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      setCookie("auth_token", data, {
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });

      try {
        const user = await fetchUser();
        queryClient.setQueryData(["user"], user);
      } catch (err: any) {
        toast.error("Failed to fetch user after login");
        console.error(err);
      }
      toast.success("Login Successful")
      router.replace("/dashboard");
    },
    onError: (err: any) => {
      throw err.response?.data?.message || "Login failed";
    },
  });
}
