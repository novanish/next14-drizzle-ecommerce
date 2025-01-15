"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CART_PROGRESS_STATE, useCartStore } from "@/lib/client-store";
import { ShoppingBagIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CartMessage } from "./cart-message";
import { CartItems } from "./cart-items";
import { Payment } from "./payment";
import { OrderConfirmed } from "./order-confirmed";
import CartProgress from "./cart-progress";

export function CartDrawer() {
  const { cart, progress, isCartOpen, toggleCartOpen } = useCartStore();

  return (
    <Drawer
      open={isCartOpen}
      onOpenChange={(open) => {
        toggleCartOpen(open);
      }}
    >
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBagIcon />
        </div>
      </DrawerTrigger>

      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>

        <CartProgress />
        <div className="overflow-auto p-4">
          {progress === CART_PROGRESS_STATE.CART_PAGE && <CartItems />}
          {progress === CART_PROGRESS_STATE.PAYMENT_PAGE && <Payment />}
          {progress === CART_PROGRESS_STATE.CONFIRMATION_PAGE && (
            <OrderConfirmed />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
