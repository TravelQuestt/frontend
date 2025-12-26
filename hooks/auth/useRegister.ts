import { register } from "@/lib/api/auth";
import { RegisterPayload } from "@/types/RegisterPayload";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: RegisterPayload) => register(payload),
        onSuccess: () => {
            toast.success("Registration successful!");
            router.push("/login");
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.errorMessage || "Registration failed";
            toast.error(msg);
        },
    });
}
