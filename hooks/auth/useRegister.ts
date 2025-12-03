"use client";

import { registerUser } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success("Registration successful!");
            router.push("/login");
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || "Registration failed";
            toast.error(msg);
        },
    });
}
