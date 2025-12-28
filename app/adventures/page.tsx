"use client";

import { useState } from "react";

import SidebarFilter from "@/components/adventures/SidebarFilter";
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

export default function AdventuresPage() {
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        orderBy: "name",
        orderDirection: "asc",
    });

    const {
        data: adventures = [],
        isLoading,
        isError,
        error
    } = useAdventures({
        page,
        size: 6,
        searchTerm,
        filters,
    });

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setPage(0);
    };

    const handleApplyFilters = (appliedFilters: typeof filters & { searchTerm: string }) => {
        setFilters(appliedFilters);
        setSearchTerm(appliedFilters.searchTerm);
        setPage(0);
    };

    if (isLoading) return <LoadingSpinner label="Loading adventures...." />
    if (isError) return <ErrorState error={error} />
    return (
        <div className="flex flex-col lg:flex-row bg-background min-h-screen text-foreground">
            <aside className="hidden lg:block lg:w-64">
                <SidebarFilter
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onApplyFilters={handleApplyFilters}
                />
            </aside>

            <main className="flex-1 p-4 sm:p-6">
                {/* Mobile filter and title */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                    <div>
                        <h1 className="text-2xl font-bold">My Adventures</h1>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">A timeline of places you’ve lived, not just visited.</p>
                    </div>
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Filter Adventures</DrawerTitle>
                            </DrawerHeader>
                            <motion.div
                                className="p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SidebarFilter searchTerm={searchTerm} onSearchChange={handleSearchChange} onApplyFilters={handleApplyFilters} />
                            </motion.div>
                        </DrawerContent>
                    </Drawer>
                </div>

                {/* Desktop title and search bar */}
                <motion.div
                    className="hidden lg:flex items-center justify-between mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div>
                        <h1 className="text-2xl font-bold">My Adventures</h1>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">A timeline of places you’ve lived, not just visited.</p>
                    </div>


                    {/* Static Add button for desktop */}
                    <div className="hidden lg:flex justify-end p-4">
                        <Link href="/adventures/new" passHref>
                            <Button>+ Add Adventure</Button>
                        </Link>
                    </div>
                </motion.div>

                <p className="hidden lg:block text-muted-foreground text-sm mb-6">
                    {adventures.length} result{adventures.length !== 1 && "s"}{searchTerm && ` matching "${searchTerm}"`}
                </p>

                {/* Adventures grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page + searchTerm}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {isLoading ? (
                            <p>Loading adventures...</p>
                        ) : adventures.length === 0 ? (
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
                                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                                    }}
                                >
                                    <Link href={`/adventures/${adv.id}`} passHref>
                                        <AdventureCard adventure={adv} />
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <motion.div
                    className="flex justify-center mt-6 space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={adventures.length < 6}
                    >
                        Next
                    </Button>
                </motion.div>
            </main>

            {/* Floating Add button for mobile */}
            <motion.div
                className="fixed bottom-4 right-4 z-50 lg:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Link href="/adventures/new" passHref>
                    <Button className="h-12 px-6 text-base shadow-lg">+ Add Adventure</Button>
                </Link>
            </motion.div>
        </div>
    );
}