"use server";

import { variantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { auth } from "../auth";
import { productVariants, variantImages, variantTags } from "../schema";
import { revalidatePath } from "next/cache";
import { algoliaClient } from "../algoliaClient";

const actionClient = createSafeActionClient();

export const createVariant = actionClient
  .schema(variantSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    if (!isAdmin) {
      return { error: "Unauthorized" };
    }

    const [[newVariant], product] = await Promise.all([
      db
        .insert(productVariants)
        .values({
          color: parsedInput.color,
          productType: parsedInput.productType,
          productId: parsedInput.productId,
        })
        .returning({ id: productVariants.id }),
      db.query.products.findFirst({
        columns: { title: true, price: true, description: true },
        where: (products, { eq }) => eq(products.id, parsedInput.productId),
      }),
    ]);

    const images = parsedInput.images.map((image, index) => ({
      variantId: newVariant.id,
      url: image.url,
      size: image.size,
      name: image.name,
      order: index,
    }));

    const tags = parsedInput.tags.map((tag) => ({
      variantId: newVariant.id,
      tag,
    }));

    const algoliaRecord = {
      objectID: newVariant.id,
      color: parsedInput.color,
      productType: parsedInput.productType,
      productId: parsedInput.productId,
      images: parsedInput.images,
      tags: parsedInput.tags,
      title: product?.title,
      price: product?.price,
      description: product?.description,
    };

    await Promise.all([
      product
        ? algoliaClient.saveObject({
            indexName: "products",
            body: algoliaRecord,
          })
        : Promise.resolve(),
      db.insert(variantImages).values(images),
      db.insert(variantTags).values(tags),
    ]);

    revalidatePath("/dashboard/products");
  });
