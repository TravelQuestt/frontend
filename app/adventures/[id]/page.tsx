"use client"

import AdventureGallery from "@/components/adventures/AdventureGallery";
import AdventureMap from "@/components/adventures/AdventureMap";
import DeleteAdventureDialog from "@/components/adventures/DeleteAdventureDialog";
import UpdateAdventureDialog from "@/components/adventures/EditAdventureDialog";
import { SelectCoverDialog } from "@/components/adventures/SelectorCoverDialog";
import { UploadImageDialog } from "@/components/adventures/UploadImageDialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription } from "@/components/ui/item";
import useAdventure from "@/hooks/adventures/useAdventure";
import useImages from "@/hooks/images/useImages";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheckIcon, Clock, MapPin, Star, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import TimeAgo from 'react-timeago';

export default function AdventureDetails() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;
    const { data: adventure, isLoading: adventureLoading } = useAdventure(id);
    const { data: images, isLoading: imagesLoading } = useImages(id);
    const [deleting, setDeleteing] = useState(false);

    if (adventureLoading) return <LoadingSpinner label="Loading adventure...." />

    const MutedText = ({ children }: { children?: React.ReactNode }) => (
        <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs font-normal mt-3"
        >
            <Clock className="h-3 w-3 opacity-70" />
            <span className="opacity-80">Updated</span>
            <span className="font-medium">{children}</span>
        </Badge>
    );
    // make spinner for adventureLoading variable
    return (
        <motion.div
            className="p-6 space-y-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-primary mb-1">✈️ {adventure?.name}</h1>
                    {adventure?.updatedAt && (
                        <TimeAgo date={adventure.updatedAt} component={MutedText} />
                    )}
                </div>

                <div className="hidden sm:flex flex-wrap gap-2 justify-end">
                    {/* GMAPS Button */}
                    <Button
                        variant="outline"
                        onClick={() =>
                            window.open(
                                `https://www.google.com/maps?q=${adventure?.latitude},${adventure?.longitude}`,
                                "_blank"
                            )
                        }
                        className="gap-2"
                    >
                        <MapPin className="w-4 h-4" /> Google Maps
                    </Button>
                    {/* Delete Button */}
                    {id && <DeleteAdventureDialog adventureId={id} />} {/* FIX ME */}
                    {id && adventure && <UpdateAdventureDialog adventureId={id} defaultValues={adventure} />}
                    {images && adventure && id && <SelectCoverDialog images={images} adventureId={id} currentCoverUrl={adventure.coverImageUrl} />}

                    {/* FIX ME */}

                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="w-full rounded-lg overflow-hidden shadow-md"
            >
                {adventure && <AdventureMap coordinates={[adventure?.longitude, adventure?.latitude]} />}
            </motion.div>
            <div className="flex justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {adventure?.location}
                </div>


                <div className="flex gap-3">
                    <Badge
                        variant="secondary"
                        className={`${adventure?.publicVisibility ? "bg-green-500 dark:bg-green-500 text-black" : "bg-blue-500 dark:bg-blue-500 text-white"}`}
                    >
                        <BadgeCheckIcon />
                        {adventure?.publicVisibility ? "Public" : "Private"}
                    </Badge>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none"
                                aria-label={`Rate ${star} star`}
                            >
                                <Star
                                    className={`h-6 w-6 transition ${star <= (adventure?.rating ?? 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* Tags */}
            <div className="flex flex-col not-first:flex-wrap gap-2">

                <h2 className="text-lg font-semibold mb-2">Tags</h2>
                <div className="flex gap-2">
                    <AnimatePresence>
                        {adventure?.tags.map(tag => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Badge variant="secondary" className="px-3 py-1 text-sm">
                                    {tag}
                                </Badge>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            {/* Description */}
            <div className="py-4">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                {/* <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{adventure?.description}</p> */}
                <Item variant="outline">
                    <ItemContent>
                        <ItemDescription>
                            {adventure?.description}
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </div>
            {/* Gallery */}
            <motion.div layout className="space-y-4">
                {/* Header + warning */}
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Gallery</h2>
                        <p className="text-muted-foreground text-sm pb-3">
                            Moments and memories from this adventure.
                        </p>

                        <AnimatePresence>
                            {deleting && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                        Click an image to permanently delete it
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-2">

                        <Button
                            variant={deleting ? "default" : "destructive"}
                            className={`gap-2 ${deleting ? "bg-red-600 hover:bg-red-700" : ""}`}
                            onClick={() => setDeleteing(!deleting)}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleting ? "Delete mode ON" : "Delete images"}
                        </Button>

                        {adventure && <UploadImageDialog adventureId={adventure.id} />}
                    </div>
                </div>
                {/* Gallery */}
                <motion.div layout>
                    {imagesLoading && <LoadingSpinner label="Loading images...." />}
                    {images && id && <AdventureGallery images={images} deleting={deleting} adventureId={id} />}
                </motion.div>
            </motion.div>

        </motion.div >
    );
}