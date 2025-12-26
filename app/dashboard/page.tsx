"use client"

import AdventureCard from "@/components/common/adventures/AdventureCard";
import useAdventures from "@/hooks/adventures/useAdventures";
import { getStats } from "@/hooks/dashboard/getStats";
import { getUser } from "@/hooks/user/getUser";
import { motion } from "framer-motion";
import { Building2, Flag, MapPin, Plane, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const { data: stats } = getStats();
    const { data: user } = getUser();
    const { data: adventures = [], isLoading, } = useAdventures({
        page: 0,
        size: 3,
        searchTerm: '',
        filters: {
            orderBy: "createdAt",
            orderDirection: "desc",
        },
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-semibold mb-2">Welcome, {user?.name}!</h1>
                <p className="text-muted-foreground mt-1 mb-8">
                    Your gateway to memories, moments, and mapped milestones.
                </p>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-muted rounded-xl p-4 flex flex-col justify-center">
                        <p className="text-3xl font-bold text-pink-500">{stats?.totalAdventures}</p>
                        <div className="flex items-center gap-2 text-base mt-1">
                            <Plane className="w-4 h-4 text-pink-500" /> Total Adventures
                        </div>
                    </div>
                    <div className="bg-muted rounded-xl p-4 flex flex-col justify-center">
                        <p className="text-3xl font-bold text-blue-500">{stats?.totalCountries}</p>
                        <div className="flex items-center gap-2 text-base mt-1">
                            <Flag className="w-4 h-4 text-blue-500" /> Countries Visited
                        </div>
                    </div>
                    <div className="bg-muted rounded-xl p-4 flex flex-col justify-center">
                        <p className="text-3xl font-bold text-green-500">{stats?.totalRegions}</p>
                        <div className="flex items-center gap-2 text-base mt-1">
                            <MapPin className="w-4 h-4 text-green-500" /> Total Visited Regions
                        </div>
                    </div>
                    <div className="bg-muted rounded-xl p-4 flex flex-col justify-center">
                        <p className="text-3xl font-bold text-cyan-500">{stats?.totalCities}</p>
                        <div className="flex items-center gap-2 text-base mt-1">
                            <Building2 className="w-4 h-4 text-cyan-500" /> Total Visited Cities
                        </div>
                    </div>
                </div>

                {/* Adventures */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold">Recent Adventures</h2>
                    <p className="text-muted-foreground mt-1 mb-6">
                        Your newest adventures at a glance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    </div>
                </section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-6 justify-start p-4"
                >
                    <Link href="/adventures/new">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative flex items-center gap-2 px-6 py-3 text-background text-lg font-medium rounded-xl bg-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <span className="absolute -inset-1 z-0 rounded-xl opacity-20 blur-md animate-pulse" />
                            <PlusCircle className="w-5 h-5 z-10" />
                            <span className="z-10">Add Adventure</span>
                        </motion.button>
                    </Link>

                    <p className="text-muted-foreground text-sm max-w-xs leading-snug">
                        Log your latest journey, share the story, and pin it to your travel map.
                    </p>
                </motion.div>
            </main>
        </div>
    );

}