import { updateAdventure } from "@/lib/api/adventures";
import { AdventurePayload } from "@/types/AdventurePayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UpdateAdventurePayload {
    adventureId: number;
    data: AdventurePayload;
}

export default function useUpdateAdventure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ adventureId, data }: UpdateAdventurePayload) => updateAdventure(adventureId, data),
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["adventures"] });
            queryClient.invalidateQueries({ queryKey: ["adventure", vars.adventureId] });
            toast.success("Adventure updated successfully.")
        },
        onError(error: any) {
            toast.error(error.response?.data?.errorMessage || "Failed to update adventure");
        },
    });
}
