import { createAdventure } from "@/lib/api/adventures";
import { AdventurePayload } from "@/types/AdventurePayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useCreateAdventure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AdventurePayload) => createAdventure(data),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["adventures"] });
            queryClient.invalidateQueries({ queryKey: ["recent-adventures"]})
            toast.success("Adventure created successfully.")
        },
        onError(error: any) {
            toast.error(error.response?.data?.errorMessage || "Failed to create adventure");
        },
    });
}
