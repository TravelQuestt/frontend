"use client"

import AdventureCard from "@/components/common/adventures/AdventureCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AdventureTimeline from "@/components/dashboard/AdventureTimeline";
import StatCard from "@/components/dashboard/StatCard";
import useRecentAdventures from "@/hooks/adventures/useRecentAdventures";
import { getStats } from "@/hooks/dashboard/getStats";
import { getUser } from "@/hooks/user/getUser";
import { motion } from "framer-motion";
import { Building2, Flag, MapPin, Plane, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const mockData = [
        { month: "Jan", count: 2 },
        { month: "Feb", count: 5 },
        { month: "Mar", count: 3 },
        { month: "Apr", count: 7 },
        { month: "May", count: 4 },
    ];
    const { data: stats } = getStats();
    const { data: user } = getUser();
    const { data: adventures = [], isLoading, } = useRecentAdventures({
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
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative mb-10 rounded-3xl p-6 bg-gradient-to-br 
             from-white/10 to-white/5 dark:from-white/5 dark:to-white/0
             backdrop-blur-xl"
                >
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                        Welcome, {user?.name}
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Your gateway to memories, moments, and mapped milestones.
                    </p>
                </motion.div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        label="Total Adventures"
                        value={stats?.totalAdventures}
                        icon={Plane}
                        color="text-pink-400"
                    />

                    <StatCard
                        label="Countries Visited"
                        value={stats?.totalCountries}
                        icon={Flag}
                        color="text-blue-400"
                    />

                    <StatCard
                        label="Regions Explored"
                        value={stats?.totalRegions}
                        icon={MapPin}
                        color="text-green-400"
                    />

                    <StatCard
                        label="Cities Visited"
                        value={stats?.totalCities}
                        icon={Building2}
                        color="text-cyan-400"
                    />
                </div>

                <AdventureTimeline data={mockData} />
                {/* Adventures */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold">Recent Adventures</h2>
                    <p className="text-muted-foreground mt-1 mb-6">
                        Your newest adventures at a glance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <LoadingSpinner label="Loading adventures...." />
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