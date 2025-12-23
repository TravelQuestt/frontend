"use client"

import useAdventure from "@/hooks/adventures/useAdventure";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { format } from "date-fns";

export default function AdventureDetails() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;
    const { data: adventure, isLoading: adventureLoading, error } = useAdventure(id);
    return (
        <motion.div
            className="p-6 space-y-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
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

        </motion.div>
    );
}