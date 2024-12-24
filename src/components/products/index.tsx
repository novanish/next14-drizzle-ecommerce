"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/helpers";

interface Props {
  variants: Array<Variant>;
}

export function Products({ variants }: Props) {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.tags.some((tag) => tag.tag === paramTag)
      );
    }
    return variants;
  }, [paramTag, variants]);

  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filtered.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.productId}`}
        >
          <Image
            className="rounded-md pb-2"
            src={variant.images[0].url}
            width={720}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}

interface Variant {
  id: number;
  color: string;
  productType: string;
  productId: string;
  product: {
    title: string;
    price: number;
  };
  images: Array<{ url: string }>;
  tags: Array<{ tag: string }>;
}
