import { z } from "zod";

export const paymentIntentSchema = z.object({
  amount: z.number().min(1),
});

export type PaymentIntentSchema = z.infer<typeof paymentIntentSchema>;
