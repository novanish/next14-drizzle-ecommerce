"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { createVariant } from "@/server/actions/create-variant";
import { variantSchema, VariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { InputTags } from "./input-tags";
import { VariantImages } from "./variant-images";
import { useState } from "react";
import { deleteVariant } from "@/server/actions/delete-variant";

interface Props {
  productId: string;
  variant?: VariantsWithImagesTags;
}

export function ProductVariant({ variant, productId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<VariantSchema>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      productId,
      id: variant?.id,
      productType: variant?.productType ?? "",
      color: variant?.color ?? "#000000",
      images: variant?.images ?? [],
      tags: variant?.tags?.map((t) => t.tag) ?? [],
    },
  });

  const { execute, isPending } = useAction(createVariant);
  const variantAction = useAction(deleteVariant);

  function onSubmit(data: VariantSchema) {
    execute(data);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <ProductVariantTooltip variant={variant} />
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-2xl overflow-y-scroll max-h-[77vh]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {variant ? `Edit ${variant.productType}` : "Create a new variant"}
          </DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add multiple images and
            tags to each variant.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the product type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <VariantImages />

            <div className="flex gap-4 items-center justify-center">
              {variant && (
                <Button
                  variant="destructive"
                  type="button"
                  disabled={variantAction.isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    variantAction.execute({ id: variant.id });
                    setIsOpen(false);
                  }}
                >
                  Delete Variant
                </Button>
              )}
              <Button
                type="submit"
                className={cn(isPending ? "animate-pulse" : "")}
                disabled={isPending}
              >
                {variant ? "Save Changes" : "Create Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ProductVariantTooltipProps {
  variant?: VariantsWithImagesTags;
}

function ProductVariantTooltip({ variant }: ProductVariantTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {variant ? (
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: variant.color }}
            />
          ) : (
            <PlusCircle className="h-5 w-5" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {variant ? variant.productType : "Create a new product variant"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
