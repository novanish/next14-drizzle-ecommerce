"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  if (!theme) return null;

  return (
    <DropdownMenuItem className="py-2 font-medium cursor-pointer  ease-in-out">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center group "
      >
        <div className="relative flex mr-5">
          <Sun
            className="group-hover:text-yellow-600  absolute group-hover:rotate-180  dark:scale-0 dark:-rotate-90 transition-all duration-750 ease-in-out"
            size={14}
          />
          <Moon
            className="group-hover:text-blue-400  scale-0 rotate-90 dark:rotate-0  dark:scale-100 transition-all ease-in-out duration-750"
            size={14}
          />
        </div>
        <p className="dark:text-blue-400 mr-3 text-secondary-foreground/75 text-yellow-600">
          {theme[0].toUpperCase() + theme.slice(1)} Mode
        </p>
        <Switch
          className="scale-75"
          checked={theme === "dark"}
          onCheckedChange={(checked) => {
            setTheme(checked ? "dark" : "light");
          }}
        />
      </div>
    </DropdownMenuItem>
  );
}
