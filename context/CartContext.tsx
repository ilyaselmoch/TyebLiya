import React, { createContext, useContext, useState, ReactNode } from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CartItem {
  id: string;
  dishName: string;
  chefName: string;
  chefId: string;
  price: number;
  quantity: number;
  img: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  clientName: string;
  clientEmail: string;
  status: "pending" | "accepted" | "cooking" | "ready" | "completed";
  timestamp: string;
  totalPrice: number;
}

interface CartContextType {
  // Cart state (items being added)
  cart: CartItem[];
  cartCount: number;
  
  // Orders state (completed/submitted orders)
  orders: Order[];
  
  // Cart actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Order actions
  submitOrder: (clientName: string, clientEmail: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Calculate total cart items
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add item to cart - increment if exists, else create new
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      
      if (existingItem) {
        // Item already in cart - increment quantity
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        // New item - add to cart
        return [...prevCart, item];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Update quantity of item in cart
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Submit order - move cart items to orders array
  const submitOrder = (clientName: string, clientEmail: string) => {
    if (cart.length === 0) return;

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: cart,
      clientName,
      clientEmail,
      status: "pending",
      timestamp: new Date().toISOString(),
      totalPrice,
    };

    // Add to orders and clear cart
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCart([]); // Clear cart after submission
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================================================
// HOOK TO USE CART CONTEXT
// ============================================================================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
