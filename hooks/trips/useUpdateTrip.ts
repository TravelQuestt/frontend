import { updateTrip } from "@/lib/api/trips";
import { TripPayload } from "@/types/TripPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UpdateTripPayload {
    tripId: number;
    data: TripPayload;
}

export default function useUpdateTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripId, data }: UpdateTripPayload) => updateTrip(tripId, data),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["trips"] });
            queryClient.invalidateQueries({ queryKey: ["trip", vars.tripId] });
            toast.success("Trip updated successfully.")
        },
        onError(error: any) {
            toast.error(error.response?.data?.errorMessage || "Failed to update trip");
        },
    });
}
