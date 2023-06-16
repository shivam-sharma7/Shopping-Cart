import { createContext, useContext, ReactNode, useState } from "react";

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface ShoppingCartContext {
  openCart: () => void
  closeCart: () => void
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number
  cartItem: CartItem[]
}

interface CartItem {
  id: number;
  quantity: number;
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0 )
 
   const openCart = () => setIsOpen(true)
   const closeCart = () => setIsOpen(false)

  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === id);

      if (existingItem) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { id, quantity: 1 }];
    });
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
