"use client";

import ThreeGlobeBackground from "@/components/login/ThreeGlobeBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth/useLogin";
import { LoginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { mutateAsync, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(LoginSchema)
    });

    async function onSubmit(values: any) {
        try {
            await mutateAsync(values);
        } catch (err: any) {
            alert(err || "Login failed");
        }
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <ThreeGlobeBackground />
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10" />

            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md space-y-6"
                >
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
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

                    {/* EMAIL */}
                    <div>
                        <Input
                            id="email"
                            placeholder="Email"
                            className="bg-white/10 text-white placeholder:text-gray-300"
                            {...register("email")}
                        />
                    </div>

                    {/* PASSWORD */}
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
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                    </div>

                    {/* LOGIN BUTTON */}
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
                            "Log in"
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

                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-300">
                    <span className="font-bold">2025 © TravelQuest</span> • Made with ❤️ at CDAC
                </div>
            </div>
        </div>
    );
}
