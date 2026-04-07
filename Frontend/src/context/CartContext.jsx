import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { syncCartToFirestore, getFirestoreCart } from '../firebase/cartService';
import { getCurrentUserId } from '../utils/authSession';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  // Initialize user ID
  const [userId, setUserId] = useState(getCurrentUserId());

  // Initialize cart from localStorage based on user ID
  const [cartItems, setCartItems] = useState(() => {
    try {
      const currentId = getCurrentUserId();
      const savedCart = localStorage.getItem(`flawskinCart_${currentId}`);
      if (savedCart) return JSON.parse(savedCart);
      
      // Fallback to legacy key for compatibility during migration
      const legacyCart = localStorage.getItem('flawskinCart');
      if (legacyCart) {
        localStorage.setItem(`flawskinCart_${currentId}`, legacyCart);
        localStorage.removeItem('flawskinCart');
        return JSON.parse(legacyCart);
      }
      return [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Track authentication changes and multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `flawskinCart_${userId}`) {
        setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'authUser') {
        const newId = getCurrentUserId();
        if (newId !== userId) setUserId(newId);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // One-time fetch and merge if user ID changes
    const syncOnUserChange = async () => {
      if (userId !== 'guest_user') {
        try {
          // Get items that were in the guest cart before switching
          const guestCart = localStorage.getItem('flawskinCart_guest_user');
          const guestItems = guestCart ? JSON.parse(guestCart) : [];

          const remoteCart = await getFirestoreCart(userId);
          
          if (guestItems.length > 0) {
            // Merge logic: Combine guest items with remote items
            const merged = [...remoteCart];
            guestItems.forEach(guestItem => {
              const existing = merged.find(i => i.id === guestItem.id);
              if (existing) {
                existing.quantity += guestItem.quantity;
              } else {
                merged.push(guestItem);
              }
            });
            
            setCartItems(merged);
            localStorage.setItem(`flawskinCart_${userId}`, JSON.stringify(merged));
            // Clear guest cart after successful merge
            localStorage.removeItem('flawskinCart_guest_user');
          } else if (remoteCart && remoteCart.length > 0) {
            setCartItems(remoteCart);
            localStorage.setItem(`flawskinCart_${userId}`, JSON.stringify(remoteCart));
          }
        } catch (error) {
          console.error("Error fetching/merging remote cart:", error);
        }
      } else {
        const savedCart = localStorage.getItem(`flawskinCart_${userId}`);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    };

    syncOnUserChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId]);

  // Save cart to localStorage whenever it changes, and sync to Firestore
  const syncTimer = useRef(null);
  useEffect(() => {
    try {
      if (cartItems.length > 0 || localStorage.getItem(`flawskinCart_${userId}`)) {
        localStorage.setItem(`flawskinCart_${userId}`, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }

    // Debounce Firestore sync to avoid excessive writes
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      syncCartToFirestore(userId, cartItems).catch(() => {});
    }, 1000);
  }, [cartItems, userId]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // New item, add to cart
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total items count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const [promoDetails, setPromoDetails] = useState(null);

  const applyPromo = (details) => {
    setPromoDetails(details);
  };

  const removePromo = () => {
    setPromoDetails(null);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    if (!promoDetails) return subtotal;

    if (promoDetails.discountType === 'percentage') {
      return subtotal * (1 - promoDetails.discountValue / 100);
    }
    return Math.max(0, subtotal - promoDetails.discountValue);
  };

  const getDiscountAmount = () => {
    const subtotal = getCartSubtotal();
    if (!promoDetails) return 0;
    if (promoDetails.discountType === 'percentage') {
      return subtotal * (promoDetails.discountValue / 100);
    }
    return promoDetails.discountValue;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartSubtotal,
    getCartTotal,
    promoDetails,
    applyPromo,
    removePromo,
    getDiscountAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
