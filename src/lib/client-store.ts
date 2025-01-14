import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Variant {
  id: number;
  quantity: number;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  variant: Variant;
}

type CartProgressState =
  (typeof CART_PROGRESS_STATE)[keyof typeof CART_PROGRESS_STATE];

interface CartState {
  cart: Array<CartItem>;
  addToCart: (i: CartItem) => void;
  removeItem: (id: number) => void;
  changeQuantityTo: (id: number, to: ((q: number) => number) | number) => void;
  progress: CartProgressState;
  changeProgressTo: (to: CartProgressState) => void;
  clearCart: () => void;
  isCartOpen: boolean;

  toggleCartOpen: (v?: boolean) => void;
}

export const CART_PROGRESS_STATE = {
  CART_PAGE: "cart-page",
  PAYMENT_PAGE: "payment-page",
  CONFIRMATION_PAGE: "confirmation-page",
} as const;

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: [],
      progress: CART_PROGRESS_STATE.CART_PAGE,
      isCartOpen: false,

      toggleCartOpen(v) {
        set(() => ({ isCartOpen: v ?? !get().isCartOpen }));
      },

      clearCart: () => {
        set(() => ({ cart: [] }));
      },

      addToCart: (item) => {
        set(() => {
          let exists = false;

          const cart = get().cart.map((existingItem) => {
            if (existingItem.variant.id !== item.variant.id)
              return existingItem;

            exists = true;
            return {
              ...existingItem,
              variant: {
                ...existingItem.variant,
                quantity: existingItem.variant.quantity + item.variant.quantity,
              },
            };
          });

          return { cart: exists ? cart : [...cart, item] };
        });
      },

      changeQuantityTo: (id, to) => {
        set(() => {
          const cart = get().cart.map((item) => {
            if (id !== item.variant.id) return item;

            return {
              ...item,
              variant: {
                ...item.variant,
                quantity:
                  typeof to === "function" ? to(item.variant.quantity) : to,
              },
            };
          });

          return { cart };
        });
      },

      removeItem: (id) => {
        set(() => {
          const cart = get().cart.filter((item) => item.variant.id !== id);
          return { cart };
        });
      },

      changeProgressTo: (to) => {
        set(() => ({ progress: to }));
      },
    }),
    { name: "cart-storage", storage: createJSONStorage(() => localStorage) }
  )
);
