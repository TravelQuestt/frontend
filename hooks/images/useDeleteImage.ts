import { deleteImage } from "@/lib/api/images";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useDeleteImage(adventureId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId: number) => deleteImage(adventureId, imageId),
        onSuccess: () => {
            toast.success("Image deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["images"] });
        },
        onError: (err: any) => {
            console.error(err);
            const msg = err?.response?.data?.errorMessage || "Image deletion failed!";
            toast.error(msg);
        },
    });
}
