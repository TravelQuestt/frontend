"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";

interface AdventureMapProps {
    coordinates: [number, number];
    onMapClick?: (lngLat: [number, number]) => void;
    isEditable?: boolean;
}

interface MapTilerFeature {
    id: string;
    place_name: string;
    geometry: {
        coordinates: [number, number];
    };
}

export default function AdventureMap({
    coordinates,
    onMapClick,
    isEditable
}: AdventureMapProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<MapTilerFeature[]>([]);
    const [showResults, setShowResults] = useState(false);
    const isProgrammaticChange = useRef(false);

    const smoothMoveTo = (coords: [number, number]) => {
        const map = mapInstanceRef.current;
        if (!map || isNaN(coords[0]) || isNaN(coords[1])) return;

        markerRef.current?.setLngLat(coords);
        map.flyTo({
            center: coords,
            zoom: 14,
            essential: true,
        });
        onMapClick?.(coords);
    };

    // 1. Initialize Map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;
        if (!coordinates || isNaN(coordinates[0]) || isNaN(coordinates[1])) return;

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
            center: coordinates,
            zoom: 12,
            trackResize: true
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        const marker = new maplibregl.Marker().setLngLat(coordinates).addTo(map);
        markerRef.current = marker;
        mapInstanceRef.current = map;

        const observer = new ResizeObserver(() => map.resize());
        observer.observe(mapRef.current);

        return () => {
            observer.disconnect();
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // 2. Handle External Coordinate Changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (map && markerRef.current) {
            const currentCenter = map.getCenter();
            const isDifferent = Math.abs(currentCenter.lng - coordinates[0]) > 0.0001 ||
                Math.abs(currentCenter.lat - coordinates[1]) > 0.0001;

            if (isDifferent && !map.isMoving()) {
                smoothMoveTo(coordinates);
            }
        }
    }, [coordinates[0], coordinates[1]]);

    // 3. Handle Map Clicks
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !isEditable) return;

        const clickHandler = (e: maplibregl.MapMouseEvent) => {
            const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
            markerRef.current?.setLngLat(lngLat);
            onMapClick?.(lngLat);
        };

        map.on("click", clickHandler);
        map.getCanvas().style.cursor = "crosshair";

        return () => {
            map.off("click", clickHandler);
            if (map.getCanvas()) map.getCanvas().style.cursor = "";
        };
    }, [isEditable, onMapClick]);

    // 4. Geolocation Logic
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => smoothMoveTo([pos.coords.longitude, pos.coords.latitude]),
            () => toast.error("Unable to access location.")
        );
    };

    // 5. Search Logic (Geocoding)
    useEffect(() => {
        if (isProgrammaticChange.current) {
            isProgrammaticChange.current = false;
            return;
        }

        if (!searchTerm.trim() || searchTerm.length < 3) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.maptiler.com/geocoding/${encodeURIComponent(searchTerm)}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
                );
                const data = await res.json();
                const foundFeatures = (data.features || []) as MapTilerFeature[];
                setResults(foundFeatures);
                if (foundFeatures.length > 0) setShowResults(true);
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // 6. Click Outside Listener
    useEffect(() => {
        const handleClickOutside = () => setShowResults(false);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSelectLocation = (lng: number, lat: number, placeName: string) => {
        isProgrammaticChange.current = true;
        setSearchTerm(placeName);
        setResults([]);
        setShowResults(false);
        smoothMoveTo([lng, lat]);
    };

    return (
        <div className="w-full space-y-2">
            <div
                ref={mapRef}
                className="w-full h-64 rounded-lg border bg-muted overflow-hidden"
            />
            {isEditable && (
                <>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <Input
                            type="text"
                            placeholder="Search for a place..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => { if (results.length > 0) setShowResults(true); }}
                            className="pr-10"
                        />
                        {showResults && results.length > 0 && (
                            <ul className="absolute bg-popover border rounded-md w-full mt-1 max-h-48 overflow-auto z-[100] shadow-md">
                                {results.map((place) => (
                                    <li
                                        key={place.id}
                                        className="px-3 py-2 text-sm hover:bg-accent cursor-pointer transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectLocation(
                                                place.geometry.coordinates[0],
                                                place.geometry.coordinates[1],
                                                place.place_name
                                            );
                                        }}
                                    >
                                        {place.place_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleUseCurrentLocation}
                        className="w-full flex gap-2 items-center"
                    >
                        <MapPin className="w-4 h-4" /> Use My Current Location
                    </Button>
                </>
            )}

            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider font-medium">
                Lat: {coordinates[1]?.toFixed(5) || "0"} | Lng: {coordinates[0]?.toFixed(5) || "0"}
            </p>
        </div>
    );
}