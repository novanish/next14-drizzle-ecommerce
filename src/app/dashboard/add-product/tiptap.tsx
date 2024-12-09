"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Props
  extends Omit<React.ComponentProps<typeof EditorContent>, "editor"> {
  name: string;
}

export function Tiptap(props: Props) {
  const { setValue } = useFormContext();

  const editor = useEditor({
    extensions: [
      Placeholder.configure({
        placeholder: props.placeholder,
        emptyNodeClass:
          "first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
      }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },

        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],

    onUpdate({ editor }) {
      const content = editor.getHTML();
      setValue(props.name, content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },

    editorProps: {
      attributes: {
        class:
          "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    content: props.value?.toString() ?? "",
  });

  useEffect(() => {
    if (editor?.isEmpty) {
      editor.commands.setContent(props.value?.toString() ?? "");
    }
  }, [props.value, editor]);

  return (
    <div className="flex flex-col gap-2">
      {editor ? (
        <div className="border-input border rounded-md">
          <ToggleWithToolTip
            toogleProps={{
              children: <Bold className="w-4 h-4" />,
              pressed: editor.isActive("bold"),
              onPressedChange: () => editor.chain().focus().toggleBold().run(),
            }}
            content="Bold"
          />

          <ToggleWithToolTip
            toogleProps={{
              children: <Italic className="w-4 h-4" />,
              pressed: editor.isActive("italic"),
              onPressedChange: () =>
                editor.chain().focus().toggleItalic().run(),
            }}
            content="Italic"
          />

          <ToggleWithToolTip
            toogleProps={{
              children: <Strikethrough className="w-4 h-4" />,
              pressed: editor.isActive("strike"),
              onPressedChange: () =>
                editor.chain().focus().toggleStrike().run(),
            }}
            content="Strikethrough"
          />

          <ToggleWithToolTip
            toogleProps={{
              children: <ListOrdered className="w-4 h-4" />,
              pressed: editor.isActive("orderedList"),
              onPressedChange: () =>
                editor.chain().focus().toggleOrderedList().run(),
            }}
            content="List Ordered"
          />

          <ToggleWithToolTip
            toogleProps={{
              children: <List className="w-4 h-4" />,
              pressed: editor.isActive("bulletList"),
              onPressedChange: () =>
                editor.chain().focus().toggleBulletList().run(),
            }}
            content="List Bullet"
          />
        </div>
      ) : null}
      <EditorContent
        {...props}
        editor={editor}
        className={cn(
          "flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          props.className
        )}
      />
    </div>
  );
}

interface ToggleToolTipProps {
  toogleProps: React.ComponentProps<typeof Toggle>;
  content: React.ReactNode;
}

function ToggleWithToolTip({ toogleProps, content }: ToggleToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            type="button"
            {...toogleProps}
            className={cn(
              toogleProps.pressed && "bg-border",
              toogleProps.className
            )}
          />
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
