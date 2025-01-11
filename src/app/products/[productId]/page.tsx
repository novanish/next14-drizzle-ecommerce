import { AddToCart } from "@/components/cart/add-to-cart";
import ProductPick from "@/components/products/product-pick";
import { ProductShowcase } from "@/components/products/product-showcase";
import ProductType from "@/components/products/product-type";
import { Reviews } from "@/components/reviews";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/helpers";
import { db } from "@/server/index";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const variants = await db.query.productVariants.findMany({});
  return variants.map((v) => ({
    productId: v.productId,
  }));
}

export default async function Page(props: Props) {
  const { productId } = props.params;
  const product = await db.query.products.findFirst({
    columns: { title: true, price: true, description: true },
    with: {
      variants: {
        with: {
          images: {
            columns: { url: true, name: true },
          },
        },
      },
    },
    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  return (
    <main>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="flex-1">
          <ProductShowcase variants={product.variants} />
        </div>
        <div className="flex  flex-col flex-1">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <div>
            <ProductType variants={product.variants} />
          </div>
          <Separator className="my-2" />
          <p className="text-2xl font-medium py-2">
            {formatPrice(product.price)}
          </p>

          <div dangerouslySetInnerHTML={{ __html: product.description }} />

          <p className="text-secondary-foreground font-medium my-2">
            Available Colors
          </p>
          <div className="flex gap-4 ">
            {product.variants.map((prodVariant) => (
              <ProductPick
                key={prodVariant.id}
                productId={productId}
                productType={prodVariant.productType}
                color={prodVariant.color}
                price={product.price}
                title={product.title}
                image={prodVariant.images[0].url}
              />
            ))}
          </div>

          <AddToCart
            productTitle={product.title}
            price={product.price}
            productId={productId}
            variants={product.variants}
          />
        </div>
      </section>

      <Reviews productId={productId} />
    </main>
  );
}

interface Props {
  params: {
    productId: string;
  };
}
