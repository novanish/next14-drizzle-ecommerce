"use server";

import { productSchema } from "@/types/product-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { auth } from "../auth";
import { products } from "../schema";
import { eq } from "drizzle-orm";

const actionClient = createSafeActionClient();

export const createProduct = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    if (!isAdmin) {
      return { error: "Unauthorized" };
    }

    if (!parsedInput.id) {
      await db.insert(products).values({
        title: parsedInput.title,
        description: parsedInput.description,
        price: parsedInput.price,
      });

      return;
    }

    await db
      .update(products)
      .set({
        title: parsedInput.title,
        description: parsedInput.description,
        price: parsedInput.price,
      })
      .where(eq(products.id, parsedInput.id));
  });
