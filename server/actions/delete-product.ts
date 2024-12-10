"use server";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { auth } from "../auth";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    if (!isAdmin) {
      return { error: "Unauthorized" };
    }

    await db.delete(products).where(eq(products.id, parsedInput.id));
    revalidatePath("/dashboard/products");
  });
