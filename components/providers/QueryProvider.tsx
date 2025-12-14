"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
    const isUnauthorized = (error) => {
        return error?.response?.status === 401;
    };

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    if (isUnauthorized(error)) {
                        console.log("401 detected. Disabling retry.");
                        return false;
                    }
                    const maxRetries = 3;
                    console.log(failureCount < maxRetries)
                    return failureCount < maxRetries;
                },
            }
        },
        queryCache: new QueryCache({
            onError: (error) => {
                if (isUnauthorized(error)) {
                    queryClient.clear();
                }
            }
        }),
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
