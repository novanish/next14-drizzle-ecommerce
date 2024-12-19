"use server";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "..";
import { auth } from "../auth";
import { productVariants } from "../schema";
import { algoliaClient } from "../algoliaClient";

const actionClient = createSafeActionClient();

export const deleteVariant = actionClient
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    if (!isAdmin) {
      return { error: "Unauthorized" };
    }

    await Promise.all([
      db.delete(productVariants).where(eq(productVariants.id, parsedInput.id)),
      algoliaClient.deleteObject({
        indexName: "products",
        objectID: parsedInput.id.toString(),
      }),
    ]);

    revalidatePath("/dashboard/products");
  });
