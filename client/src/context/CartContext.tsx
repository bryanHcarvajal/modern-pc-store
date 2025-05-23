import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type {ReactNode} from 'react';
import { useAuth } from './AuthContext'; 
import type { Product } from '../components/Products/ProductCard'; 

export interface CartItem {
  id: string; 
  productId: string;
  quantity: number;
  priceAtAddition: number;
  product: Product;
}

export interface CartState {
  id: string; 
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cart: CartState | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number; 
  getCartTotalAmount: () => number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { token, isAuthenticated} = useAuth(); 
  const [cart, setCart] = useState<CartState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3000'; 

  const makeAuthenticatedRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!token) {
      setError("Usuario no autenticado. No se puede realizar la acción del carrito.");
      throw new Error("Usuario no autenticado");
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Error en la petición a ${endpoint}`);
    }
    return response.json();
  }, [token]);


  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data: CartState = await makeAuthenticatedRequest('/cart');
      setCart(data);
    } catch (err: any) {
      console.error("Error al obtener el carrito:", err);
      setError(err.message);
      setCart(null); 
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, makeAuthenticatedRequest]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, token, fetchCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart: CartState = await makeAuthenticatedRequest('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      setCart(updatedCart);
    } catch (err: any) {
      console.error("Error al añadir al carrito:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) { 
        await removeItemFromCart(cartItemId);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart: CartState = await makeAuthenticatedRequest(`/cart/items/${cartItemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
      setCart(updatedCart);
    } catch (err: any) {
      console.error("Error al actualizar cantidad:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeItemFromCart = async (cartItemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart: CartState = await makeAuthenticatedRequest(`/cart/items/${cartItemId}`, {
        method: 'DELETE',
      });
      setCart(updatedCart);
    } catch (err: any) {
      console.error("Error al eliminar item:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart: CartState = await makeAuthenticatedRequest('/cart', {
        method: 'DELETE',
      });
      setCart(updatedCart); 
    } catch (err: any) {
      console.error("Error al vaciar el carrito:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotalAmount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.priceAtAddition * item.quantity), 0);
  };


  const contextValue = {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
    getTotalItems,
    getCartTotalAmount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};