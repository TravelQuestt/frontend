import { z } from "zod";

export const UpdateAdventureSchema = z.object({
    name: z
        .string()
        .min(3, "Adventure name must be at least 3 characters")
        .max(120, "Adventure name cannot exceed 120 characters"),

    rating: z
        .number()
        .min(0, "Rating cannot be less than 0")
        .max(5, "Rating cannot be more than 5"),


    latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),

    longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),

    publicVisibility: z.boolean(),

    tags: z
        .array(
            z
                .string()
                .min(2, "Tag must be at least 2 characters")
                .max(30, "Tag cannot exceed 30 characters")
                .nonempty("Tag cannot be empty")
        )
        .max(5, "Maximum 5 tags allowed"),

    description: z
        .string()
        .max(2000, "Description cannot exceed 2000 characters")
        .optional()
        .or(z.literal("")),
});

export type UpdateAdventureFormValues = z.infer<typeof UpdateAdventureSchema>;
