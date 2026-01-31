"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "@/lib/api/user";
import { toast } from "react-toastify";

export default function AuthCallbackClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;

        const token = searchParams.get("token");
        const error = searchParams.get("error");

        const handleSuccess = async (authToken: string) => {
            setCookie("auth_token", authToken, {
                path: "/",
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24,
            });

            try {
                const user = await fetchUser();
                queryClient.setQueryData(["user"], user);
            } catch {
                toast.error("Failed to fetch user after login");
            }

            toast.success("Login Successful");
            router.replace("/dashboard");
        };

        if (token) {
            processed.current = true;
            handleSuccess(token);
        } else if (error) {
            processed.current = true;
            toast.error(decodeURIComponent(error));
            router.replace("/login");
        }
    }, [searchParams, router, queryClient]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-lg font-medium">
                    Completing secure login...
                </p>
            </div>
        </div>
    );
}
