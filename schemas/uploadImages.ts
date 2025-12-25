import { z } from "zod";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

const MAX_SIZE_MB = 5;
const MAX_FILES = 10;

export const uploadImagesSchema = z.object({
    images: z
        .array(
            z
                .instanceof(File)
                .refine((file) => ALLOWED_TYPES.includes(file.type), {
                    message: "Unsupported file type",
                })
                .refine((file) => file.size <= MAX_SIZE_MB * 1024 * 1024, {
                    message: "File size must be under 5MB",
                })
        )
        .min(1, "Select at least one image")
        .max(MAX_FILES, `You can upload up to ${MAX_FILES} images`),
});

export type UploadImagesForm = z.infer<typeof uploadImagesSchema>;
