"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  color: string;
  productType: string;
  title: string;
  price: number;
  productId: string;
  image: string;
}

export default function ProductPick({ color, productType, productId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || productType;

  return (
    <div
      style={{ background: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hober: opacity-75",
        selectedColor === productType ? "opacity-100" : "opacity-50"
      )}
      onClick={() =>
        router.push(`/products/${productId}?type=${productType}`, {
          scroll: false,
        })
      }
    ></div>
  );
}
