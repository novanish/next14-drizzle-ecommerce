"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import placeholder from "@/public/placeholder_small.jpg";
import { deleteProduct } from "@/server/actions/delete-product";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { ProductVariant } from "./product-variant";

interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  variants: Array<VariantsWithImagesTags>;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue<number>("price");
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(price);

      return <span className="font-medium text-xs">{formatted}</span>;
    },
  },

  {
    accessorKey: "variants",
    header: "Variants",
    cell: VariantCell,
  },

  {
    accessorKey: "image",
    header: "Image",
    cell: ImageCell,
  },

  {
    id: "actions",
    header: "Actions",
    cell: ActionCell,
  },
];

interface CellProps {
  row: Row<Product>;
}

function ImageCell({ row }: CellProps) {
  const cellImage = row.getValue<string>("image") ?? placeholder.src;
  const cellTitle = row.getValue<string>("title");

  return (
    <Image
      src={cellImage}
      alt={cellTitle}
      width={40}
      height={40}
      className="rounded-md"
    />
  );
}

function ActionCell({ row }: CellProps) {
  const product = row.original;
  const { execute, isPending } = useAction(deleteProduct);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function VariantCell({ row }: CellProps) {
  const variants =
    (row.getValue("variants") as Array<VariantsWithImagesTags>) ?? [];

  return (
    <div className="flex gap-2">
      {variants.map((variant) => (
        <ProductVariant
          key={variant.id}
          variant={variant}
          productId={row.original.id}
        />
      ))}
      <ProductVariant productId={row.original.id} />
    </div>
  );
}
