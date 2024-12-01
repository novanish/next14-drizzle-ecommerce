import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, TruckIcon } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { SignOut } from "./sign-out-";
import { ThemeSwitch } from "./theme-switch";

interface Props {
  session: Session;
}

export function UserButton({ session: { user } }: Props) {
  const fallback =
    user?.name
      ?.split(" ")
      .map((n) => n[0].toUpperCase())
      .join("") ?? "NE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-9 w-9">
          {user?.image ? (
            <AvatarImage
              src={user.image}
              alt={user?.name || "User Avatar"}
              asChild
            >
              <Image
                src={user.image}
                alt={user?.name || "User Avatar"}
                width={28}
                height={28}
              />
            </AvatarImage>
          ) : null}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/10">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name!}
              className="rounded-full"
              width={36}
              height={36}
            />
          ) : null}
          <p className="font-bold text-xs">{user?.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user?.email}
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="group py-2 font-medium cursor-pointer "
          asChild
        >
          <Link href="/dashboard/orders">
            <TruckIcon
              size={14}
              className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
            />{" "}
            My orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="group py-2 font-medium cursor-pointer  ease-in-out "
          asChild
        >
          <Link href="/dashboard/settings">
            <Settings
              size={14}
              className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            />
            Settings
          </Link>
        </DropdownMenuItem>

        <ThemeSwitch />
        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
