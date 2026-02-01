"use client";

import ThreeGlobeBackground from "@/components/login/ThreeGlobeBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/auth/useLogin";
import { LoginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function LoginClient() {
    const [showPassword, setShowPassword] = useState(false);
    const { mutateAsync, isPending } = useLogin();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const toastShown = useRef(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(LoginSchema)
    });

    async function onSubmit(values: any) {
        await mutateAsync(values);
    }

    const handleGoogleLogin = () => {
        window.location.href =
            "http://localhost:9000/oauth2/authorization/google";
    };

    useEffect(() => {
        if (error && !toastShown.current) {
            toast.error(error);
            toastShown.current = true;

            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        }
    }, [error]);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <ThreeGlobeBackground />
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10" />

            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-1">
                            <h1 className="text-3xl font-bold text-white">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-gray-300">
                                Sign in to continue your adventures
                            </p>
                        </div>

                        {errors.email && (
                            <p className="text-sm text-red-500 border border-red-500 rounded p-2 bg-white/10">
                                {errors.email.message?.toString()}
                            </p>
                        )}

                        {errors.password && (
                            <p className="text-sm text-red-500 border border-red-500 rounded p-2 bg-white/10">
                                {errors.password.message?.toString()}
                            </p>
                        )}

                        <div>
                            <Input
                                id="email"
                                placeholder="Email"
                                className="bg-white/10 text-white placeholder:text-gray-300"
                                {...register("email")}
                            />
                        </div>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="bg-white/10 text-white placeholder:text-gray-300 pr-10"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        <Button
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
                            disabled={isPending}
                            type="submit"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-between gap-2">
                                    <LogIn /> Log In
                                </span>
                            )}
                        </Button>

                        <p className="text-sm text-center text-gray-300">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-cyan-400 hover:underline font-medium"
                            >
                                Register
                            </Link>
                        </p>
                    </form>

                    <Separator className="bg-white/20 my-6" />

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-3 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        disabled={isPending}
                        onClick={handleGoogleLogin}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="h-6 w-6"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.1 0 5.9 1.1 8.1 3.1l6-6C34.4 2.8 29.6 1 24 1 14.8 1 6.9 6.5 3 14.5l7.3 5.7C12.1 14.1 17.6 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.3 2-1.9 5-5.3 7l8.2 6.4c4.8-4.4 7.5-10.9 7.5-17.1z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.3 28.2c-.5-1.4-.8-2.8-.8-4.2s.3-2.8.8-4.2L3 14.1C1.1 17.8 0 21.8 0 26s1.1 8.2 3 11.9l7.3-5.7z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 47c6.5 0 12-2.1 16-5.7l-8.2-6.4c-2.2 1.5-5 2.6-7.8 2.6-6.4 0-11.9-4.6-13.7-10.7L3 37.9C6.9 45.9 14.8 47 24 47z"
                            />
                        </svg>
                        Sign up with Google
                    </Button>
                </div>

                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-300">
                    <span className="font-bold">2025 © TravelQuest</span> •
                    Made with ❤️ at CDAC
                </div>
            </div>
        </div>
    );
}
