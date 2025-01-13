"use server";

import { paymentIntentSchema } from "@/types/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import Stripe from "stripe";
import { auth } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const actionClient = createSafeActionClient();

export const createPaymentIntent = actionClient
  .schema(paymentIntentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session) return { error: "Please login to continue" };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsedInput.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        input: JSON.stringify(parsedInput),
      },
    });

    return {
      success: {
        paymentIntentId: paymentIntent.id,
        clientSecretId: paymentIntent.client_secret,
        user: session.user.email,
      },
    };
  });
