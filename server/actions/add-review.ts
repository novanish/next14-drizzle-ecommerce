"use server";

import { reviewSchema } from "@/types/review-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { auth } from "../auth";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .schema(reviewSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session?.user.id) {
      return { error: "Unauthorized" };
    }

    await db.insert(reviews).values({
      comment: parsedInput.comment,
      rating: parsedInput.rating,
      productId: parsedInput.productId,
      userId: session.user.id,
    });

    revalidatePath(`/products/${parsedInput.productId}`);
  });
