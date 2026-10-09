import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'TOGGLE_ITEM'; payload: { product: Product } }
  | { type: 'CLEAR_WISHLIST' };

const STORAGE_KEY = 'app_wishlist_v1';

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'TOGGLE_ITEM': {
      const exists = state.items.some((item) => item.product.id === action.payload.product.id);
      if (exists) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== action.payload.product.id),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload.product, addedAt: new Date().toISOString() }],
      };
    }
    case 'CLEAR_WISHLIST':
      return { items: [] };
    default:
      return state;
  }
}

interface WishlistContextType {
  items: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] }, () => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? { items: JSON.parse(localData) } : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [state.items]);

  const toggleWishlist = (product: Product) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: { product } });
  };

  const isInWishlist = (productId: string) => {
    return state.items.some((item: WishlistItem) => item.product.id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalWishlistItems: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
