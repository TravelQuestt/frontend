"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { LoginPayload } from "@/types/LoginPayload";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: () => {
      router.replace("/dashboard"); // redirect after login
    },
    onError: (err: any) => {
      throw err.response?.data?.message || "Login failed";
    },
  });
}
