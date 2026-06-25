import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import type { Producto } from '../api/productos';

interface CartItem extends Producto {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Producto, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Obtener la clave de localStorage para el usuario actual
const getCartStorageKey = (): string | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return `cart_${user.id}`;
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar carrito cuando cambia el usuario (al iniciar sesión)
  useEffect(() => {
    const storageKey = getCartStorageKey();
    if (storageKey) {
      const storedCart = localStorage.getItem(storageKey);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, []); // Se ejecuta una vez al montar, pero también se podría escuchar cambios en localStorage

  // Guardar carrito cada vez que cambie, pero solo si hay un usuario logueado
  useEffect(() => {
    const storageKey = getCartStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Producto, quantity: number = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    const storageKey = getCartStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.precio) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};