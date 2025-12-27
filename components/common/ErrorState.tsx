"use client";

import Link from "next/link";
import { AxiosError } from "axios";
import {
    AlertTriangle,
    Map,
    Compass,
    RefreshCw,
    Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ErrorStateProps = {
    error?: unknown;
    title?: string;
    description?: string;
    showRetry?: boolean;
    onRetry?: () => void;
};

export default function ErrorState({
    error,
    title,
    description,
    showRetry = true,
    onRetry,
}: ErrorStateProps) {
    let statusCode: number | undefined;
    let message = description;

    if (error && error instanceof AxiosError) {
        statusCode = error.response?.data?.errorCode;
        message =
            error.response?.data?.errorMessage ||
            error.message ||
            "Something went wrong";
    }

    const computedTitle =
        title ||
        (statusCode === 404
            ? "Adventure Lost"
            : statusCode === 400
                ? "Wrong Turn Taken"
                : "Journey Interrupted");

    const computedDescription =
        description ||
        (statusCode === 404
            ? "This path doesn’t exist anymore. The map might be outdated or the URL was changed."
            : statusCode === 400
                ? "The request seems invalid. Try adjusting filters or navigating differently."
                : "We hit a bump on the road. Take a breath and try again.");

    const Icon =
        statusCode === 404 || statusCode === 400 ? Map : AlertTriangle;

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <Card className="max-w-md w-full text-center shadow-xl border-muted">
                <CardContent className="p-8 space-y-7">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-muted">
                            <Icon className="h-8 w-8 text-muted-foreground" />
                            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-primary animate-pulse" />
                        </div>
                    </div>

                    {/* Error code */}
                    {statusCode && (
                        <div className="flex justify-center">
                            <Badge variant="outline">
                                Error {statusCode}
                            </Badge>
                        </div>
                    )}

                    {/* Text */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {computedTitle}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {computedDescription}
                        </p>

                        {message && (
                            <p className="text-xs text-muted-foreground italic">
                                “{message}”
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        {showRetry && onRetry && (
                            <Button
                                onClick={onRetry}
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Retry
                            </Button>
                        )}

                        <Link href="/adventures">
                            <Button variant="outline" className="gap-2">
                                <Compass className="h-4 w-4" />
                                Explore Adventures
                            </Button>
                        </Link>
                    </div>

                    {/* Footer branding */}
                    <div className="pt-4 border-t border-muted">
                        <p className="text-xs text-muted-foreground">
                            TravelQuest • Every journey has detours
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
