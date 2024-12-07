import * as z from "zod";

export const productSchema = z.object({
  id: z.string().optional().nullable(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters long")
    .max(1_000, "Description must be at most 1000 characters long"),

  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be a positive number"),
});

export type ProductSchema = z.infer<typeof productSchema>;
