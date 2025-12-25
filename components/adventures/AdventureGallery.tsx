"use client";

import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

import { ImageDTO } from "@/types/ImageDTO";

interface Props {
    images: ImageDTO[];
}

export default function AdventureGallery({ images }: Props) {
    return (
        <LightGallery
            plugins={[lgThumbnail, lgZoom, lgVideo]}
            elementClassNames="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            mode="lg-fade"
            thumbnail
            zoom
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
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {/* {item.type === "VIDEO" ? "View video" : "View photo"} */}
                            <span className="rounded-md bg-white/20 px-4 py-1 backdrop-blur text-white">
                                View
                            </span>
                        </span>
                    </div>

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
