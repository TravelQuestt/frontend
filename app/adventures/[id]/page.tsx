"use client"

import DeleteAdventureDialog from "@/components/adventures/DeleteAdventureDialog";
import UpdateAdventureDialog from "@/components/adventures/EditAdventureDialog";
import { Button } from "@/components/ui/button";
import useAdventure from "@/hooks/adventures/useAdventure";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, Pencil, UploadCloud } from "lucide-react";
import { useParams } from "next/navigation";

export default function AdventureDetails() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;
    const { data: adventure, isLoading: adventureLoading, error } = useAdventure(id);
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
                    {id && <DeleteAdventureDialog adventureId={id} />}
                    {id && adventure && <UpdateAdventureDialog adventureId={id} defaultValues={adventure} />} {/* FIX ME */}
                    <Button
                        variant="default"
                        // onClick={() => setUploadingPhotos(prev => !prev)}
                        className="gap-1"
                    >
                        <UploadCloud className="w-4 h-4" /> Upload Images
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}