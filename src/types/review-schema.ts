import * as z from "zod";

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(1).max(500),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
