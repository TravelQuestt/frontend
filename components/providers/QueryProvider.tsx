"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
    const isUnauthorized = (error: unknown): boolean => {
        return (
            axios.isAxiosError(error) &&
            error.response?.status === 401
        );
    };

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    if (isUnauthorized(error)) {
                        return false;
                    }
                    const maxRetries = 3;
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
