import { createTrip } from "@/lib/api/trips";
import { TripPayload } from "@/types/TripPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useCreateTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TripPayload) => createTrip(data),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["trips"] });
            queryClient.invalidateQueries({ queryKey: ["recent-trips"]})
            toast.success("Trip created successfully.")
        },
        onError(error: any) {
            toast.error(error.response?.data?.errorMessage || "Failed to create trip");
        },
    });
}
