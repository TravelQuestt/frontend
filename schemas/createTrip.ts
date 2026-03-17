import { z } from "zod";

export const createTripSchema = z
  .object({
    title: z
      .string()
      .min(1, "Trip title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional()
      .default(""),
    status: z.enum(["PLANNED", "ONGOING", "COMPLETED"], {
      required_error: "Trip status is required",
    }),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export type CreateTripFormValues = z.infer<typeof createTripSchema>;