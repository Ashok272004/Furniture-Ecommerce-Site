import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    const savedCart = localStorage.getItem("furninest-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("furninest-cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product) {
  setItems((currentItems) => {
    const stock = Number(product.stock);
    if (stock <= 0) return currentItems;

    const existing = currentItems.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity >= stock) return currentItems;

      return currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...currentItems, { ...product, quantity: 1 }];
  });
}
  function changeQuantity(productId, amount) {
  setItems((currentItems) =>
    currentItems
      .map((item) => {
        if (item.id !== productId) return item;

        const stock = Number(item.stock);
        const nextQuantity = item.quantity + amount;

        return {
          ...item,
          quantity: Math.min(nextQuantity, stock),
        };
      })
      .filter((item) => item.quantity > 0)
  );
}

  function removeFromCart(productId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      cartTotal,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}