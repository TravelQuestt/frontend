"use client"

import { getUser } from "@/hooks/user/getUser";
import { Building2, Flag, MapPin, Plane, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import AdventureCard from "@/components/common/adventures/AdventureCard";
import { AdventureDTO } from "@/types/AdventureDTO";
import { getStats } from "@/hooks/dashboard/getStats";
import TravelCard from "@/components/common/adventures/TravelCard";

export default function Dashboard() {
    const { data: stats } = getStats();
    const { data: user } = getUser();
    const loading = false;
    const adventures: AdventureDTO[] = [
        {
            id: 1,
            name: "Sunset Trek at Mount Cooroora",
            location: "Queensland, Australia",
            tags: ["hiking", "sunset", "mountains"],
            description: "A breathtaking golden-hour hike with panoramic views.",
            rating: 4.8,
            link: "https://example.com/adventure/1",
            publicVisibility: true,
            latitude: -26.4422,
            longitude: 152.9531,
            imageUrls: [
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            ],
            createdAt: "2025-01-10T12:30:00Z",
            likesCount: 42,
            likedByCurrentUser: false,
        },
        {
            id: 2,
            name: "Kayaking in Lake Tahoe",
            location: "California, USA",
            tags: ["kayaking", "water", "lake"],
            description: "Crystal-clear water kayaking surrounded by Sierra Nevada.",
            rating: 4.7,
            link: "https://example.com/adventure/2",
            publicVisibility: true,
            latitude: 39.0968,
            longitude: -120.0324,
            imageUrls: [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            ],
            createdAt: "2025-02-01T08:45:00Z",
            likesCount: 67,
            likedByCurrentUser: true,
        },
        {
            id: 3,
            name: "Street Food Tour in Tokyo",
            location: "Tokyo, Japan",
            tags: ["food", "city", "culture"],
            description: "Savouring Japan’s best street foods across Shinjuku and Shibuya.",
            rating: 5.0,
            link: "https://example.com/adventure/3",
            publicVisibility: true,
            latitude: 35.6762,
            longitude: 139.6503,
            imageUrls: [
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            ],
            createdAt: "2025-02-10T14:20:00Z",
            likesCount: 98,
            likedByCurrentUser: true,
        },
        {
            id: 4,
            name: "Sahara Desert Camel Ride",
            location: "Merzouga, Morocco",
            tags: ["desert", "camel", "adventure"],
            description: "Riding across golden dunes during a magical sunset.",
            rating: 4.6,
            link: "https://example.com/adventure/4",
            publicVisibility: true,
            latitude: 31.0994,
            longitude: -4.0127,
            imageUrls: [
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            ],
            createdAt: "2025-01-25T17:10:00Z",
            likesCount: 120,
            likedByCurrentUser: false,
        },
        {
            id: 5,
            name: "Northern Lights Hunt",
            location: "Tromsø, Norway",
            tags: ["aurora", "night", "sky"],
            description: "Chasing the magical aurora borealis in the Arctic sky.",
            rating: 5.0,
            link: "https://example.com/adventure/5",
            publicVisibility: true,
            latitude: 69.6492,
            longitude: 18.9553,
            imageUrls: [
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            ],
            createdAt: "2025-01-30T22:00:00Z",
            likesCount: 150,
            likedByCurrentUser: true,
        },
    ];
    return (
        <div className="min-h-screen bg-background text-foreground">
            <TravelCard/>
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
                        {loading ? (
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