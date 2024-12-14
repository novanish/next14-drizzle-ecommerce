"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProduct } from "@/server/actions/create-product";
import { getProduct } from "@/server/actions/get-product";
import { productSchema, ProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Tiptap } from "./tiptap";

export function ProductForm() {
  const searchParams = useSearchParams();
  const hasProductId = searchParams.has("id");
  const defaultValues = {
    title: "",
    description: "",
    price: 0,
  };
  console.log(hasProductId, "hasProductId");

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: hasProductId
      ? async () => {
          const id = searchParams.get("id")!;
          const product = await getProduct(id);
          if (!product) {
            return defaultValues;
          }
          console.log(product, "product");
          return { ...product, id };
        }
      : defaultValues,
  });
  const router = useRouter();

  const { execute, isPending } = useAction(createProduct, {
    onSuccess() {
      router.push("/dashboard/products");
    },
  });

  function onSubmit(data: ProductSchema) {
    execute(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          {hasProductId ? "Edit Product" : "Add Product"}
        </CardTitle>
        <CardDescription>
          {hasProductId
            ? "Edit the product details below"
            : "Add a new product to your store"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap
                      className="border border-gray-300 rounded-md"
                      placeholder="Add a description for the product"
                      {...field}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        size={36}
                        className="bg-muted p-2 rounded-md"
                      />
                      <Input placeholder="Product price in USD" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isPending}>
              {hasProductId ? "Save Changes" : "Add Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
