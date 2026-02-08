"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";

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
type TripStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

const statusStyles = {
  UPCOMING: "border-blue-500 text-blue-500",
  ONGOING: "border-green-500 text-green-500",
  COMPLETED: "border-muted-foreground text-muted-foreground",
};

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <div className="relative h-40">
        <Image
          src={trip.coverImage}
          alt={trip.name}
          fill
          className="object-cover"
        />
        <Badge
          variant="outline"
          className={`absolute top-3 left-3 ${statusStyles[trip.status]}`}
        >
          {trip.status}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{trip.name}</h3>

        <p className="text-sm text-muted-foreground">
          {trip.startDate} → {trip.endDate}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{trip.locationSummary}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {trip.adventureCount} adventures
          </span>

          <Link href={`/trips/${trip.id}`}>
            <Button size="sm" variant="secondary">
              View Trip
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
