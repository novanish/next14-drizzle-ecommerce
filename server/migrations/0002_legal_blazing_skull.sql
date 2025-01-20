ALTER TYPE "public"."order_status" ADD VALUE 'PAID' BEFORE 'SHIPPED';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_intent_id" text;