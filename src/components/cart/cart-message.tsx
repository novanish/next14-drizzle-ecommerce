"use client";

import { CART_PROGRESS_STATE, useCartStore } from "@/lib/client-store";
import { motion } from "motion/react";
import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { ArrowLeft } from "lucide-react";

export function CartMessage() {
  const { progress, changeProgressTo } = useCartStore();

  return (
    <motion.div
      className=" text-center"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle>
        {progress === CART_PROGRESS_STATE.CART_PAGE ? "Your Cart Items" : null}
        {progress === CART_PROGRESS_STATE.PAYMENT_PAGE
          ? "Choose a payment method"
          : null}
        {progress === CART_PROGRESS_STATE.CONFIRMATION_PAGE
          ? "Order Confirmed"
          : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {progress === CART_PROGRESS_STATE.CART_PAGE
          ? "  View and edit your bag."
          : null}
        {progress === CART_PROGRESS_STATE.PAYMENT_PAGE ? (
          <span
            onClick={() => changeProgressTo(CART_PROGRESS_STATE.CART_PAGE)}
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
          >
            <ArrowLeft size={14} /> Head back to cart
          </span>
        ) : null}
        {progress === CART_PROGRESS_STATE.CONFIRMATION_PAGE
          ? "You will recieve an email with your receipt!"
          : null}
      </DrawerDescription>
    </motion.div>
  );
}
