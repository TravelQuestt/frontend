import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<Loading />}>
            <AuthCallbackClient />
        </Suspense>
    );
}

function Loading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Completing secure login...</p>
        </div>
    );
}
