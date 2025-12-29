"use client";

import { useState } from "react";
import SidebarFilter, {
    SidebarFilters,
} from "@/components/adventures/SidebarFilter";
import AdventureCard from "@/components/common/adventures/AdventureCard";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import useAdventures from "@/hooks/adventures/useAdventures";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorState from "@/components/common/ErrorState";
import CreateAdventureDialog from "@/components/adventures/CreateAdventureDialog";

const DEFAULT_FILTERS: SidebarFilters = {
    searchTerm: "",
    orderBy: "name",
    orderDirection: "asc",
    privacy: "all",
    pageNumber: 0,
    pageSize: 9,
};

export default function AdventuresPage() {
    const [filters, setFilters] =
        useState<SidebarFilters>(DEFAULT_FILTERS);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {
        data: adventures = [],
        isLoading,
        isError,
        error,
    } = useAdventures({
        page: filters.pageNumber,
        size: filters.pageSize,
        searchTerm: filters.searchTerm,
        filters: {
            orderBy: filters.orderBy,
            orderDirection: filters.orderDirection,
            privacy: filters.privacy,
        },
    });

    const applyFilters = () => {
        setFilters((prev) => ({
            ...prev,
            pageNumber: 0,
        }));
        setDrawerOpen(false);
    };

    if (isLoading)
        return <LoadingSpinner label="Loading adventures..." />;

    if (isError) return <ErrorState error={error} />;

    return (
        <div className="flex flex-col lg:flex-row bg-background min-h-screen text-foreground">
            <aside className="hidden lg:block lg:w-64 border-r">
                <SidebarFilter
                    filters={filters}
                    onChange={setFilters}
                    onApply={applyFilters}
                />
            </aside>

            <main className="flex-1 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                    <div>
                        <h1 className="text-2xl font-bold">My Adventures</h1>
                        <p className="text-muted-foreground text-sm">
                            A timeline of places you’ve lived, not just visited.
                        </p>
                    </div>

                    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                        <DrawerTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </DrawerTrigger>

                        <DrawerContent className="h-[85vh]">
                            <DrawerHeader>
                                <DrawerTitle>Filter Adventures</DrawerTitle>
                            </DrawerHeader>

                            <div className="h-full overflow-y-auto">
                                <motion.div
                                    className="p-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SidebarFilter
                                        filters={filters}
                                        onChange={setFilters}
                                        onApply={applyFilters}
                                    />
                                </motion.div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                <motion.div
                    className="hidden lg:flex items-center justify-between mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1 className="text-2xl font-bold">My Adventures</h1>
                        <p className="text-muted-foreground text-sm">
                            A timeline of places you’ve lived, not just visited.
                        </p>
                    </div>

                    <CreateAdventureDialog />
                </motion.div>

                <p className="hidden lg:block text-muted-foreground text-sm mb-6">
                    {adventures.length} result
                    {adventures.length !== 1 && "s"}
                    {filters.searchTerm &&
                        ` matching "${filters.searchTerm}"`}
                </p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${filters.pageNumber}-${filters.searchTerm}`}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {adventures.length === 0 ? (
                            <p>No adventures found.</p>
                        ) : (
                            adventures.map((adv, index) => (
                                <motion.div
                                    key={adv.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                    }}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow:
                                            "0px 4px 20px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <Link href={`/adventures/${adv.id}`}>
                                        <AdventureCard adventure={adv} />
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-center mt-6 gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setFilters((f) => ({
                                ...f,
                                pageNumber: Math.max(f.pageNumber - 1, 0),
                            }))
                        }
                        disabled={filters.pageNumber === 0}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setFilters((f) => ({
                                ...f,
                                pageNumber: f.pageNumber + 1,
                            }))
                        }
                        disabled={adventures.length < filters.pageSize}
                    >
                        Next
                    </Button>
                </div>
            </main>

            <motion.div
                className="fixed bottom-4 right-4 z-50 lg:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
            >
                <CreateAdventureDialog />
            </motion.div>
        </div>
    );
}