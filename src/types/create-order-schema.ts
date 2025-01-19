import { z } from "zod";

export const orderSchema = z.object({
  amount: z.number().min(1),
  paymentIntentId: z.string(),
  products: z
    .array(
      z.object({
        quantity: z.number().min(1),
        productId: z.string(),
        variantId: z.number(),
      })
    )
    .min(1),
});

export type PaymentIntentSchema = z.infer<typeof orderSchema>;
