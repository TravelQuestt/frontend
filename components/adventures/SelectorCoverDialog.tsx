"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { ImageDTO } from "@/types/ImageDTO";
import { useSetCover } from "@/hooks/adventures/useSetCover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type Props = {
    images: ImageDTO[];
    currentCoverUrl?: string;
    adventureId: number;
};

export function SelectCoverDialog({
    images,
    currentCoverUrl,
    adventureId
}: Props) {
    const [selectedUrl, setSelectedUrl] = useState<string | undefined>(
        currentCoverUrl
    );
    const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
    const setCover = useSetCover(adventureId)

    const handleSelect = async (imageId: number, imageUrl: string) => {
        if (imageUrl === currentCoverUrl) return;

        setLoadingUrl(imageUrl);
        setSelectedUrl(imageUrl);
        try {
            await toast.promise(
                setCover.mutateAsync(imageId), {
                pending: "Updating cover image!"
            }
            )
        } catch {
            setSelectedUrl(currentCoverUrl);
            toast.error("Failed to update cover image");
        } finally {
            setLoadingUrl(null);
        }
    };

    return (
        <Dialog>
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <button
                                className="rounded-md border px-3 py-1 text-sm flex items-center gap-1
                     bg-yellow-500 font-medium text-black hover:bg-yellow-200"
                            >
                                <Star className="h-4 w-4 fill-black" />
                            </button>
                        </DialogTrigger>
                    </TooltipTrigger>

                    <TooltipContent side="top">
                        <p>Change cover image</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Select cover image</DialogTitle>
                    <DialogDescription>
                        Choose the image that best represents this adventure
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((img) => {
                        const isSelected = img.imageUrl === selectedUrl;
                        const isCurrent = img.imageUrl === currentCoverUrl;
                        return (
                            <button
                                key={img.id}
                                type="button"
                                onClick={() => handleSelect(img.id, img.imageUrl)}
                                className={cn(
                                    "group relative overflow-hidden rounded-xl border transition",
                                    isSelected
                                        ? "ring-2 ring-yellow-500"
                                        : "hover:ring-2 hover:ring-muted-foreground"
                                )}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt="Cover option"
                                    className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                                />

                                {/* Current cover badge */}
                                {isCurrent && (
                                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-black">
                                        <Star className="h-3 w-3 fill-black" />
                                        Current
                                    </div>
                                )}

                                {/* Selected overlay */}
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        {loadingUrl === img.imageUrl ? (
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <Check className="h-8 w-8 text-white" />
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
