import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Review, OrderCustomer, PaymentMethod, PaymentStatus } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  isAdminMode: boolean;
  orders: Order[];
  toggleAdminMode: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (customer: OrderCustomer, paymentMethod: PaymentMethod, paymentStatus?: PaymentStatus, isGuest?: boolean) => void;
  updateOrderStatus: (orderId: string, status: PaymentStatus) => void;
  addReview: (productId: string, review: Review) => void;
  cartTotal: number;
  cartCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumina_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lumina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lumina_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleAdminMode = () => setIsAdminMode(prev => !prev);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (
    customer: OrderCustomer,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus = 'pending',
    isGuest: boolean = true
  ) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      date: new Date().toISOString(),
      customer,
      paymentMethod,
      paymentStatus,
      isGuest
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [review, ...p.reviews] };
      }
      return p;
    }));
  };

  const updateOrderStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, paymentStatus: status } : order
    ));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      isAdminMode,
      orders,
      toggleAdminMode,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addReview,
      cartTotal,
      cartCount
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
