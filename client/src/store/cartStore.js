import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id)

          if (existingItem) {
            if (existingItem.quantity >= product.stock) return state
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            }
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          }
        }),
      setQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((entry) => entry.id === productId)
          if (
            !item ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > item.stock
          ) return state

          return {
            items: state.items.map((entry) =>
              entry.id === productId
                ? { ...entry, quantity }
                : entry,
            ),
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        useCartStore
          .getState()
          .items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    { name: 'northstar-cart' },
  ),
)