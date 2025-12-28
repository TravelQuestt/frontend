"use client";

import { Badge } from "@/components/ui/badge";
import { AdventureDTO } from "@/types/AdventureDTO";
import { Star, MapPin, BadgeCheckIcon } from "lucide-react";
import Image from "next/image";

type AdventureCardProps = {
    adventure: AdventureDTO;
};

export default function AdventureCard({ adventure }: AdventureCardProps) {
    const coverImageUrl =
        adventure.coverImageUrl?.length > 0
            ? adventure.coverImageUrl
            : "/adventure_place.webp";

    return (
        <div className="group relative rounded-xl overflow-hidden bg-card transition-all duration-300 hover:shadow-lg">
            {/* IMAGE WRAPPER - Changed to 16:10 for a sleeker, less "tall" look */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                    src={coverImageUrl}
                    alt={adventure.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* TOP BADGES */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
                    {/* TAGS - Minimalist style */}
                    <div className="flex gap-1">
                        {/* {adventure.tags?.slice(0, 1).map((tag, idx) => (
                            <span key={idx} className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md border border-white/10 uppercase font-semibold tracking-wider">
                                {tag}
                            </span>
                        ))} */}
                        <Badge
                            variant="secondary"
                            className={`${adventure?.publicVisibility ? "bg-green-500 dark:bg-green-500 text-black" : "bg-blue-500 dark:bg-blue-500 text-white"}`}
                        >
                            <BadgeCheckIcon />
                            {adventure?.publicVisibility ? "Public" : "Private"}
                        </Badge>
                    </div>

                    {/* RATING */}
                    {typeof adventure.rating === "number" && (
                        <div className="flex items-center gap-1 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-[11px] font-bold shadow-sm">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{adventure.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* BOTTOM CONTENT OVERLAY - Gradient is more subtle now */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">

                    <div className="flex justify-between items-center">
                        <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-300 ml-2 mb-2">
                            <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-1">
                                {adventure.name}
                            </h3>

                            <div className="flex items-center gap-1 text-white/80 text-[11px] mt-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">{adventure.location}</span>
                            </div>
                        </div>

                        <div className="flex gap-1 self-end mb-1">
                            {adventure.tags?.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className=" backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md border border-white/10 uppercase font-semibold tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}