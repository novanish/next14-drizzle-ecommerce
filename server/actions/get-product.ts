"use server";

import { db } from "..";

export async function getProduct(id: string) {
  return db.query.products.findFirst({
    columns: { id: false, createdAt: false, updatedAt: false },
    where: (products, { eq }) => eq(products.id, id),
  });
}
