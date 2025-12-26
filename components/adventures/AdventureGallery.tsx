"use client";

import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

import { ImageDTO } from "@/types/ImageDTO";
import { Trash2 } from "lucide-react";
import { useDeleteImage } from "@/hooks/images/useDeleteImage";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useState } from "react";

interface Props {
    deleting: boolean;
    images: ImageDTO[];
    adventureId: number;
}

export default function AdventureGallery({ images, deleting, adventureId }: Props) {
    const deleteImage = useDeleteImage(adventureId);
    const [confirmImageId, setConfirmImageId] = useState<number | null>(null);

    const handleConfirmDelete = async () => {
        if (!confirmImageId) return;
        await deleteImage.mutateAsync(confirmImageId);
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
            {images.map((item) => (
                <a
                    key={item.id}
                    data-src={item.imageUrl}
                    className="group relative overflow-hidden rounded-xl border bg-muted"
                >
                    {/* Image */}
                    <img
                        // src={item.thumbnailUrl ?? item.imageUrl}
                        src={item.imageUrl}
                        alt="Adventure media"
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:blur-[1px]"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50" />

                    {/* Center text */}

                    {!deleting &&
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                {/* {item.type === "VIDEO" ? "View video" : "View photo"} */}
                                <span className="rounded-md bg-white/20 px-4 py-1 backdrop-blur text-white">
                                    View
                                </span>
                            </span>
                        </div>
                    }
                    {/* 🗑️ Delete button */}
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
                    <AlertDialog open={!!confirmImageId} onOpenChange={() => setConfirmImageId(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete image?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action is permanent. The image will be removed from this adventure.
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

                    {/* Optional video icon */}
                    {/* {item.type === "VIDEO" && (
                        <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                            VIDEO
                        </div>
                    )} */}
                </a>

            ))}
        </LightGallery>
    );
}
