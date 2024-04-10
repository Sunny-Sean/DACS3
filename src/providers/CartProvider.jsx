import { createContext, useContext, useState } from "react";
import { CartItem, Product } from "../types";
import { randomUUID } from "expo-crypto";

const CartContext = createContext({
  items: [],
  addItem: () => {},
});

const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (product, size) => {
    const newCartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  console.log(items);

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
