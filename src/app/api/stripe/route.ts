import { db } from "@/server/index";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const sig = req.headers.get("stripe-signature") || "";
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  const reqText = await req.text();
  const reqBuffer = Buffer.from(reqText);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
  } catch (err) {
    console.error(err);
    return new NextResponse("Webhook Error'", {
      status: 400,
    });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ["latest_charge"] }
      );
      const charge = retrieveOrder.latest_charge as Stripe.Charge;

      await db
        .update(orders)
        .set({
          status: "PAID",
          reciptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentId, event.data.object.id));
      break;

    default:
      console.log(`${event.type}`);
  }

  return new Response("ok", { status: 200 });
}
