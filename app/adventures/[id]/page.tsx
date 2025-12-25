"use client"

import AdventureGallery from "@/components/adventures/AdventureGallery";
import AdventureMap from "@/components/adventures/AdventureMap";
import DeleteAdventureDialog from "@/components/adventures/DeleteAdventureDialog";
import UpdateAdventureDialog from "@/components/adventures/EditAdventureDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription } from "@/components/ui/item";
import useAdventure from "@/hooks/adventures/useAdventure";
import useImages from "@/hooks/images/useImages";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Star, UploadCloud } from "lucide-react";
import { useParams } from "next/navigation";

export default function AdventureDetails() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;
    const { data: adventure, isLoading: adventureLoading } = useAdventure(id);
    const { data: images, isLoading: imagesLoading } = useImages(id);
    console.log(images)
    if (adventureLoading) return <div>loading</div>
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
                    {adventure?.createdAt && (
                        <p className="text-sm text-muted-foreground">
                            Created at:{" "}
                            {format(
                                new Date(adventure.createdAt),
                                "dd MMM yyyy, hh:mm a"
                            )}
                        </p>
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
                    {id && adventure && <UpdateAdventureDialog adventureId={id} defaultValues={adventure} />} {/* FIX ME */}

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
                <div>{adventure?.publicVisibility}</div>
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
            <div className="flex justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Gallery</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">Moments and memories from this adventure.</p>
                </div>
                <Button
                    variant="default"
                    className="gap-1"
                >
                    <UploadCloud className="w-4 h-4" /> Upload Images
                </Button>
            </div>
            <div>
                {images && <AdventureGallery images={images} />}
            </div>
        </motion.div >
    );
}