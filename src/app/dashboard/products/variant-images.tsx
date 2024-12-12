"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { VariantSchema } from "@/types/variant-schema";
import { Trash } from "lucide-react";
import { Reorder } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function VariantImages() {
  const [active, setActive] = useState(0);
  const form = useFormContext<VariantSchema>();
  const { fields, append, remove, update, move } = useFieldArray({
    control: form.control,
    name: "images",
  });

  console.log(fields, "fields");

  return (
    <>
      <FormField
        control={form.control}
        name="images"
        render={() => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <UploadDropzone
                endpoint="variantImage"
                className=" ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                onUploadError={(error) => {
                  form.setError("images", {
                    type: "validate",
                    message: error.message,
                  });
                }}
                onBeforeUploadBegin={(files) => {
                  const uploads = files.map((file) => {
                    return {
                      url: URL.createObjectURL(file),
                      size: file.size,
                      name: file.name,
                    };
                  });

                  append(uploads);

                  return files;
                }}
                onClientUploadComplete={(files) => {
                  const images = form.getValues("images");
                  images.map((field, imgIDX) => {
                    if (field.url.search("blob:") === 0) {
                      const image = files.find(
                        (img) => img.name === field.name
                      );

                      if (image) {
                        URL.revokeObjectURL(field.url);
                        update(imgIDX, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        });
                      }
                    }
                  });
                  return;
                }}
                config={{ mode: "auto" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[active];
              e.map((item, index) => {
                if (item === activeElement) {
                  move(active, index);
                  setActive(index);
                }
              });
            }}
          >
            {fields.map((field, index) => {
              const isBlobUrl = field.url.search("blob:") === 0;

              return (
                <Reorder.Item
                  as="tr"
                  key={field.id}
                  value={field}
                  id={field.id}
                  onDragStart={() => setActive(index)}
                  className={cn(
                    "text-sm font-bold text-muted-foreground hover:text-primary",
                    isBlobUrl ? "animate-pulse transition-all" : ""
                  )}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{bytesToMB(field.size).toFixed(2)} MB</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Image
                        src={field.url}
                        alt={field.name}
                        className="rounded-md"
                        width={50}
                        height={50}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      type="button"
                      className="scale-75"
                      disabled={isBlobUrl}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Trash className="h-4" />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </Table>
      </div>
    </>
  );
}

function bytesToMB(bytes: number) {
  return bytes / 1024 / 1024;
}
