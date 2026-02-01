import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginClient />
        </Suspense>
    );
}

function LoginLoading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
            <p className="text-lg font-medium">Loading login...</p>
        </div>
    );
}
