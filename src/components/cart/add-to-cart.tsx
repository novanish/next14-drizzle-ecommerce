"use client";

import { useCartStore } from "@/lib/client-store";
import { Minus, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  price: number;
  productId: string;
  productTitle: string;
  variants: Array<{
    id: number;
    productType: string;
    images: Array<Record<"url", string>>;
  }>;
}

export function AddToCart({ price, productId, variants, productTitle }: Props) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const variant = variants[0];
  const params = useSearchParams();
  const id = Number(params.get("id")) || variant.id;
  const type = params.get("type") || variant.productType;
  const image = params.get("image") || variant.images[0].url;

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          onClick={() => {
            setQuantity(quantity - 1);
          }}
          variant={"secondary"}
          className="text-primary"
          disabled={quantity <= 1}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button variant={"secondary"} className="flex-1">
          Quantity: {quantity}
        </Button>
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          variant={"secondary"}
          className="text-primary"
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          addToCart({
            id: productId,
            variant: { id, quantity },
            name: productTitle + " " + type,
            price,
            image,
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
}
