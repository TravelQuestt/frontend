import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdventure } from "@/lib/api/adventures";
import { toast } from "react-toastify";

export default function useDeleteAdventure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteAdventure(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["adventures"] });
            queryClient.invalidateQueries({ queryKey: ["adventure", id] });
            toast.success("Adventure deleted successfully.")
        },
        onError(error: any) {
            toast.error(error.response?.data?.errorMessage || "Failed to delete adventure");
        },
    });
}
