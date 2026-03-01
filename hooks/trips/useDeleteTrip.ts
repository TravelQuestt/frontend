import { deleteTrip } from "@/lib/api/trips";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useDeleteTrip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTrip(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["trips"] });
            queryClient.invalidateQueries({ queryKey: ["trip", id] });
            toast.success("Trip deleted successfully.")
        },
        onError(error: any) {
            toast.error(error.response?.data?.errorMessage || "Failed to delete trip");
        },
    });
}
