"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { CART_PROGRESS_STATE, useCartStore } from "@/lib/client-store";
import Lottie from "lottie-react";
import { motion } from "motion/react";
import orderConfirmed from "@/public/order-confirmed.json";

export function OrderConfirmed() {
  const { changeProgressTo, toggleCartOpen } = useCartStore();

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie className="h-56 my-4" animationData={orderConfirmed} />
      </motion.div>
      <h2 className="text-2xl font-medium">Thank you for your purchase!</h2>
      <Button
        variant={"secondary"}
        onClick={() => {
          changeProgressTo(CART_PROGRESS_STATE.CART_PAGE);
          toggleCartOpen();
        }}
        asChild
      >
        <Link href="/dashboard/orders">View your order</Link>
      </Button>
    </div>
  );
}
