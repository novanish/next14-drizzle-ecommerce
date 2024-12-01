"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <DropdownMenuItem
      onClick={() => signOut()}
      className="py-2 group font-medium cursor-pointer focus:bg-destructive/30"
    >
      <LogOut
        size={14}
        className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out"
      />
      Sign out
    </DropdownMenuItem>
  );
}
