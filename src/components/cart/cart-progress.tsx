"use client";

import { motion } from "motion/react";
import { CART_PROGRESS_STATE, useCartStore } from "@/lib/client-store";
import { Check, CreditCard, ShoppingCart } from "lucide-react";

export default function CartProgress() {
  const { progress } = useCartStore();

  return (
    <div className="flex items-center justify-center pb-6">
      <div className="w-64 h-3 bg-muted rounded-md relative">
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between">
          <motion.span
            className="absolute bg-primary  left-0 top-0 z-30  ease-in-out h-full"
            initial={{ width: 0 }}
            animate={{
              width:
                progress === CART_PROGRESS_STATE.CART_PAGE
                  ? 0
                  : progress === CART_PROGRESS_STATE.PAYMENT_PAGE
                  ? "50%"
                  : "100%",
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-primary rounded-full p-2 z-50"
          >
            <ShoppingCart className="text-white" size={14} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale:
                progress === CART_PROGRESS_STATE.PAYMENT_PAGE
                  ? 1
                  : 0 || progress === CART_PROGRESS_STATE.CONFIRMATION_PAGE
                  ? 1
                  : 0,
            }}
            transition={{ delay: 0.25 }}
            className="bg-primary rounded-full p-2 z-50"
          >
            <CreditCard className="text-white" size={14} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: progress === CART_PROGRESS_STATE.CONFIRMATION_PAGE ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
            className="bg-primary rounded-full p-2 z-50"
          >
            <Check className="text-white" size={14} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
