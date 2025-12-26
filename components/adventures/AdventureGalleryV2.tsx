"use client";

import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

import { ImageDTO } from "@/types/ImageDTO";
import { Trash2, ImageIcon, Check } from "lucide-react";
import { useDeleteImage } from "@/hooks/images/useDeleteImage";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
    deleting: boolean;
    images: ImageDTO[];
    adventureId: number;
    coverImage: string;
    onSetCover: (imageUrl: string) => void;
}

export default function AdventureGalleryV2({
    images,
    deleting,
    adventureId,
    coverImage,
    onSetCover,
}: Props) {
    const deleteImage = useDeleteImage(adventureId);
    const [confirmImageId, setConfirmImageId] = useState<number | null>(null);

    const handleConfirmDelete = async () => {
        if (!confirmImageId) return;

        await toast.promise(deleteImage.mutateAsync(confirmImageId), {
            pending: "Deleting image...",
        });

        setConfirmImageId(null);
    };

    return (
        <LightGallery
            plugins={[lgThumbnail, lgZoom, lgVideo]}
            elementClassNames="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            mode="lg-fade"
            thumbnail
            zoom
            selector={deleting ? "" : "a"}
        >
            {images.map((item) => {
                const isCover = item.imageUrl === coverImage;

                return (
                    <a
                        key={item.id}
                        data-src={item.imageUrl}
                        className={`
              group relative overflow-hidden rounded-xl border bg-muted cursor-pointer
              ${isCover ? "ring-2 ring-primary" : ""}
            `}
                    >
                        {/* Image */}
                        <img
                            src={item.imageUrl}
                            alt="Adventure media"
                            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:blur-[1px]"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50" />

                        {/* Cover Badge */}
                        {isCover && (
                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                                <Check className="h-3 w-3" />
                                Cover
                            </div>
                        )}

                        {/* View text */}
                        {!deleting && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <span className="rounded-md bg-white/20 px-4 py-1 text-sm font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                                    View
                                </span>
                            </div>
                        )}

                        {/* 🖼️ Set Cover Button */}
                        {!deleting && !isCover && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    onSetCover(item.imageUrl);
                                }}
                                className="pointer-events-auto absolute z-10 bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-black/70 px-3 py-1 text-xs text-white opacity-0 transition hover:bg-black group-hover:opacity-100"
                            >
                                <ImageIcon className="h-3.5 w-3.5" />
                                Set cover
                            </button>
                        )}

                        {/* 🗑️ Delete Mode */}
                        {deleting && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setConfirmImageId(item.id);
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500/90 text-white opacity-0 transition-opacity duration-300 hover:bg-red-600 group-hover:opacity-100"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </a>
                );
            })}

            {/* Delete confirmation */}
            <AlertDialog
                open={!!confirmImageId}
                onOpenChange={() => setConfirmImageId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete image?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent. The image will be removed from this
                            adventure.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </LightGallery>
    );
}