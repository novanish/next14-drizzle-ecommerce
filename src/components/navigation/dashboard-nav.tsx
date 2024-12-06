"use client";

import { cn } from "@/lib/utils";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Link = { label: string; path: string; icon: JSX.Element };

interface Props {
  isAdmin: boolean;
}

const userLinks = [
  {
    label: "Orders",
    path: "/dashboard/orders",
    icon: <Truck size={16} />,
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: <Settings size={16} />,
  },
] as const;

const adminLinks = [
  {
    label: "Analytics",
    path: "/dashboard/analytics",
    icon: <BarChart size={16} />,
  },
  {
    label: "Create",
    path: "/dashboard/add-product",
    icon: <PenSquare size={16} />,
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icon: <Package size={16} />,
  },
];

export function DashboardNav({ isAdmin }: Props) {
  const pathname = usePathname();
  const links = [...(isAdmin ? adminLinks : []), ...userLinks];

  return (
    <nav className="py-2 overflow-auto mb-4">
      <ul className="flex gap-6 text-xs font-semibold ">
        <AnimatePresence>
          {links.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
              <Link
                className={cn(
                  "flex gap-1 flex-col items-center relative",
                  pathname === link.path && "text-primary"
                )}
                href={link.path}
              >
                {link.icon}
                {link.label}
                {pathname === link.path ? (
                  <motion.span
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
