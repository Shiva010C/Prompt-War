import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const handleQuickAdd = (item, price) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item);
      if (existing) {
        return prev.map(i => i.name === item ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { name: item, price, qty: 1 }];
    });
  };

  const handleRemoveItem = (item) => {
    setCart(prev => prev.filter(i => i.name !== item));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    setActiveOrder(cart);
    setCart([]);
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
        cart, 
        activeOrder, 
        totalCartPrice, 
        handleQuickAdd, 
        handleRemoveItem, 
        checkout 
    }}>
      {children}
    </CartContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
