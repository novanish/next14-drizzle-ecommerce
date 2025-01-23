import { Products } from "@/components/products";
import { Algolia } from "@/components/products/algolia";
import { ProductTags } from "@/components/products/product-tags";
import { db } from "@/server/index";

export default async function Home() {
  const variants = await db.query.productVariants.findMany({
    with: {
      images: { columns: { url: true }, limit: 1 },
      tags: { columns: { tag: true }, limit: 1 },
      product: { columns: { title: true, price: true } },
    },
    limit: 20,
  });

  return (
    <>
      <Algolia />
      <ProductTags />
      <Products variants={variants} />
    </>
  );
}
