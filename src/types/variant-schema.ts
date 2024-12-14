import * as z from "zod";

const variantImageSchema = z.object({
  id: z.number().optional(),
  url: z.string().refine((url) => url.search("blob:") !== 0, {
    message: "Please wait for the image to upload",
  }),
  size: z.number().int().positive(),
  key: z.string().optional(),
  name: z.string(),
});

export const variantSchema = z.object({
  id: z.number().optional(),
  productId: z.string(),
  productType: z
    .string()
    .min(3, "Product type must be at least 3 characters long"),
  color: z.string().min(3, "Color must be at least 3 characters long"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(7, "Maximum of 7 tags allowed"),
  images: z
    .array(variantImageSchema)
    .min(1, "At least one image is required")
    .max(7, "Maximum of 7 images allowed"),
});

export type VariantSchema = z.infer<typeof variantSchema>;
