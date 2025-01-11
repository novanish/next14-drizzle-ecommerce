import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Variant {
  id: string;
  quantity: number;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  variant: Variant;
}

interface CartState {
  cart: Array<CartItem>;
  addToCart: (i: CartItem) => void;
  removeItem: (id: string) => void;
  changeQuantityTo: (id: string, to: ((q: number) => number) | number) => void;
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: [],
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
    }),
    { name: "cart-storage", storage: createJSONStorage(() => localStorage) }
  )
);
