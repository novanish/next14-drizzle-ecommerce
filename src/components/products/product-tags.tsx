"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

const tags = [
  { name: "All", color: "bg-black-50 hover:bg-black/75 hover:opacity-100" },
  { name: "Blue", color: "bg-blue-500 hover:bg-blue-600 hover:opacity-100" },
  {
    name: "Green",
    color: "bg-green-500 hover:bg-green-600 hover:opacity-100",
  },
  {
    name: "Purple",
    color: "bg-purple-500 hover:bg-purple-600 hover:opacity-100",
  },
];

export function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const selectedTag = params.get("tag") || "all";

  const setFilter = (tag: string) => {
    router.push(`?tag=${tag}`);
  };

  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      {tags.map((tag) => {
        const tagName = tag.name.toLowerCase();

        return (
          <Badge
            key={tag.name}
            onClick={() => setFilter(tagName)}
            className={cn(
              "cursor-pointer",
              tag.color,
              tagName === selectedTag && tag ? "opacity-100" : "opacity-50"
            )}
          >
            {tag.name}
          </Badge>
        );
      })}
    </div>
  );
}
