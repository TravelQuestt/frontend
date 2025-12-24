"use client"

import { Button } from "@/components/ui/button";
import useAdventure from "@/hooks/adventures/useAdventure";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, Trash2, UploadCloud } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function AdventureDetails() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;
    const { data: adventure, isLoading: adventureLoading, error } = useAdventure(id);
    const [isDeleting, setIsDeleting] = useState(false);
    console.log(adventure)
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
                        variant="destructive"
                        // onClick={() => setShowDeleteDialog(true)}
                        className="gap-1"
                        disabled={isDeleting}
                    >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? "Deleting..." : "Delete Adventure"}
                    </Button>
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
                    <Button
                        variant="secondary"
                        // onClick={() => (editing ? handleSaveAdventureDetails() : setEditing(true))}
                        className="gap-1"
                    // disabled={isSavingDetails}
                    >
                        {/* {editing ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                        {editing ? (isSavingDetails ? "Saving..." : "Save Details") : "Edit Details"} */}
                    </Button>
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