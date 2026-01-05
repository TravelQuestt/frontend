"use client";

import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

import useAdventures from "@/hooks/adventures/useAdventures";
import { getStats } from "@/hooks/dashboard/getStats";
import { Globe2, Plane, Star } from "lucide-react";

export default function MapPage() {
    const mapRef = useRef<maplibregl.Map | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const markerInstancesRef = useRef<Marker[]>([]);

    const { data: stats } = getStats();

    const { data: adventures = [] } = useAdventures({
        page: 0,
        size: 1000,
        searchTerm: "",
        filters: {
            orderBy: "name",
            orderDirection: "asc",
            privacy: "all",
        },
    });

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
            center: [0, 20],
            zoom: 2,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || adventures.length === 0) return;

        markerInstancesRef.current.forEach(m => m.remove());
        markerInstancesRef.current = [];

        const bounds = new maplibregl.LngLatBounds();

        adventures.forEach(adventure => {
            if (
                typeof adventure.latitude !== "number" ||
                typeof adventure.longitude !== "number"
            ) {
                return;
            }

            const marker = new Marker({ color: "#007cbf" })
                .setLngLat([adventure.longitude, adventure.latitude])
                .setPopup(new maplibregl.Popup().setText(adventure.name))
                .addTo(map);

            markerInstancesRef.current.push(marker);
            bounds.extend([adventure.longitude, adventure.latitude]);
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 120 });
        }
    }, [adventures]);

    return (
        <main className="relative min-h-screen bg-background">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />

            <div className="max-w-screen-2xl mx-auto px-6 pt-10 pb-6">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    🌍 Adventure Map
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    A visual footprint of every place you’ve explored.
                </p>
            </div>

            <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <div
                        ref={containerRef}
                        className="h-[70vh] min-h-[520px] w-full"
                    />

                    <div className="absolute left-6 bottom-6 z-20 hidden md:block">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <StatCard
                                icon={<Plane className="h-8 w-8" />}
                                value={adventures.length}
                                label="Adventures"
                            />
                            <StatCard
                                icon={<Globe2 className="h-8 w-8" />}
                                value={stats?.totalCountries ?? "—"}
                                label="Countries"
                            />
                            <StatCard
                                icon={<Star className="h-8 w-8" />}
                                value={stats?.averageRating ?? "—"}
                                label="Rating"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-16" />
        </main>
    );
}

/* ---------- Small helper ---------- */

function StatCard({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: number | string;
    label: string;
}) {
    return (
        <div className="w-56 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-lg">
            <div className="mb-2 text-black">{icon}</div>
            <div className="text-3xl font-bold text-black">{value}</div>
            <div className="text-sm text-black">{label}</div>
        </div>
    );
}
