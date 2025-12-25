import { uploadImages } from "@/lib/api/images";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useUploadImages(adventureId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (images: File[]) => uploadImages(adventureId, images),
        onSuccess: () => {
            toast.success("Images uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["images"] });

        },
        onError: (err: any) => {
            console.error(err);
            const msg = err?.response?.data?.errorMessage || "Image upload failed!";
            toast.error(msg);
        },
    });
}
