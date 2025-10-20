import { create } from 'zustand';

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  discountAmount: number;
  shipToId?: string;
  farmerCompanyId?: string;
}

interface CartStore {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (amount: number) => void;
  setShipTo: (shipToId: string) => void;
  setFarmer: (farmerCompanyId: string) => void;
  getTotal: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: {
    items: [],
    discountAmount: 0,
  },

  addItem: (item) =>
    set((state) => {
      const existingItem = state.cart.items.find(i => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
        return state;
      }
      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, item],
        },
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter(i => i.productId !== productId),
      },
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const item = state.cart.items.find(i => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        item.subtotal = item.quantity * item.unitPrice;
      }
      return state;
    }),

  setDiscount: (amount) =>
    set((state) => ({
      cart: { ...state.cart, discountAmount: amount },
    })),

  setShipTo: (shipToId) =>
    set((state) => ({
      cart: { ...state.cart, shipToId },
    })),

  setFarmer: (farmerCompanyId) =>
    set((state) => ({
      cart: { ...state.cart, farmerCompanyId },
    })),

  getTotal: () => {
    const state = get();
    const subtotal = state.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    return Math.max(0, subtotal - state.cart.discountAmount);
  },

  clearCart: () =>
    set({
      cart: {
        items: [],
        discountAmount: 0,
      },
    }),
}));
