import TripCard from "@/components/trips/TripCard";
import TripList from "@/components/trips/TripList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

type TripStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

interface Trip {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: TripStatus;
    coverImage: string;
    locationSummary: string;
    adventureCount: number;
}


const mockTrips: Trip[] = [
    {
        id: "1",
        name: "Goa Beach Escape",
        startDate: "2025-12-10",
        endDate: "2025-12-18",
        status: "UPCOMING",
        coverImage:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        locationSummary: "Goa, India",
        adventureCount: 5,
    },
    {
        id: "2",
        name: "Himalayan Trek",
        startDate: "2025-09-02",
        endDate: "2025-09-14",
        status: "ONGOING",
        coverImage:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        locationSummary: "Himachal Pradesh, India",
        adventureCount: 8,
    },
    {
        id: "3",
        name: "Europe Backpacking",
        startDate: "2024-06-01",
        endDate: "2024-06-28",
        status: "COMPLETED",
        coverImage:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        locationSummary: "France · Italy · Germany",
        adventureCount: 14,
    },
];

export default function TripsPage() {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Trips</h1>
                    <p className="text-muted-foreground">
                        Plan, organize, and relive your journeys
                    </p>
                </div>

                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Trip
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <Input placeholder="Search trips..." className="w-[220px]" />

                <Select>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Trips Grid */}
            {mockTrips.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">No trips yet</p>
                    <p>Create your first trip to get started ✈️</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mockTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                    <TripList />
                </div>

            )}

        </div>
    );
}
