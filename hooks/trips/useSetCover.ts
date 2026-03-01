import { setCover } from "@/lib/api/images";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useSetCover(adventureId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId: number) => setCover(adventureId, imageId),
        onSuccess: () => {
            toast.success("Cover image set successfully!");
            queryClient.invalidateQueries({ queryKey: ["adventures"] });
            queryClient.invalidateQueries({ queryKey: ["adventure", adventureId] });
            queryClient.invalidateQueries({ queryKey: ["images"] });
        },
        onError: (err: any) => {
            console.error(err);
            const msg = err?.response?.data?.errorMessage || "Cover image selection failed!";
            toast.error(msg);
        },
    });
}
