"use server";

import { orderSchema } from "@/types/create-order-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { orderProducts, orders, products } from "../schema";
import { inArray } from "drizzle-orm";

const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .schema(orderSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session) return { error: "Please login to continue" };

    const prices = await db.query.products.findMany({
      columns: { id: true, price: true },
      where: inArray(
        products.id,
        parsedInput.products.map((p) => p.productId)
      ),
    });

    const productsWithPrices = parsedInput.products.map((p) => {
      const product = prices.find((price) => price.id === p.productId)!;

      return {
        ...p,
        price: product.price,
      };
    });

    const totalPrice = productsWithPrices.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    );

    await db.transaction(async (tx) => {
      const [{ id }] = await tx
        .insert(orders)
        .values({
          userId: session.user.id,
          total: totalPrice,
        })
        .returning({ id: orders.id });

      const orderProductsData = productsWithPrices.map((p) => ({
        orderId: id,
        variantId: p.variantId,
        productId: p.productId,
        quantity: p.quantity,
        price: p.price,
      }));

      await tx.insert(orderProducts).values(orderProductsData);
    });

    return { success: "Order created successfully" };
  });
