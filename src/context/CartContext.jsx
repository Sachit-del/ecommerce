import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('thread_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal 0.1 for 10%
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    localStorage.setItem('thread_cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, selectedSize = 'M', selectedColor = null, quantity = 1) => {
    const color = selectedColor || (product.colors && product.colors[0] ? product.colors[0] : { name: 'Default', hex: '#222' });
    const cartItemId = `${product.id}-${selectedSize}-${color.name}`;

    setItems(prevItems => {
      const existing = prevItems.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images ? product.images[0] : '',
            category: product.category,
            size: selectedSize,
            color: color,
            quantity: quantity,
            maxStock: product.stock
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (cartItemId) => {
    setItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromoCode = (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'THREAD10' || normalized === 'GOOGLE10') {
      setPromoCode(normalized);
      setAppliedDiscount(0.10);
      setPromoError('');
      return true;
    } else if (normalized === 'THREAD20') {
      setPromoCode(normalized);
      setAppliedDiscount(0.20);
      setPromoError('');
      return true;
    } else {
      setPromoError('Invalid promo code. Try "THREAD10"');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedDiscount(0);
    setPromoError('');
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const freeShippingThreshold = 100;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 12.00;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoCode,
        setPromoCode,
        appliedDiscount,
        applyPromoCode,
        removePromoCode,
        promoError,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        totalItemsCount,
        freeShippingThreshold
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
