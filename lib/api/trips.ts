import axios from "@/lib/axios";
import { TripDTO } from "@/types/TripDTO";
import { TripPayload } from "@/types/TripPayload";

export type FetchMyTripsParams = {
    page: number;
    size?: number;
    searchTerm?: string;
    sortBy: string;
    order: string;
    status: string;
};

export async function fetchAllTrips(
    params: FetchMyTripsParams
): Promise<TripDTO[]> {
    const res = await axios.get<TripDTO[]>("/trips", {
        params: {
            page: params.page,
            size: params.size ?? 6,
            searchTerm: params.searchTerm || undefined,
            sortBy: params.sortBy,
            order: params.order,
        },
    });

    return res.data;
}

export async function fetchTrip(id: number): Promise<TripDTO> {
    const res = await axios.get<TripDTO>(`/trips/${id}`);
    return res.data;
}

export async function deleteTrip(id: number): Promise<void> {
    await axios.delete(`/trips/${id}`);
}

export async function updateTrip(id: number, trip: TripPayload) {
    await axios.put(`/trips/${id}`, trip);
}

export async function createTrip(trip: TripPayload) {
    await axios.post("/trips", trip)
}