import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '@/features/cart/context/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { Button, ResponsiveImage, Rating, useToast } from '@/components/ui';
import { useMetaTags } from '@/hooks/useMetaTags';

export const WishlistPage: React.FC = () => {
  const { items, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useMetaTags({
    title: 'Saved Wishlist',
    description: 'View your saved favorite tech products and move them to cart.',
  });

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product);
    showToast(`Moved ${product.name} to shopping cart`, 'success');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Wishlist is Empty</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Save your favorite items here by clicking the heart icon on any product.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Explore Products Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Saved Wishlist</span>
            <span className="text-xs font-bold px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full border border-rose-200 dark:border-rose-800">
              {items.length} Items
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Items saved in your local browser session
          </p>
        </div>

        <button
          onClick={() => {
            clearWishlist();
            showToast('Cleared all items from wishlist', 'info');
          }}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Clear Saved Items
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(({ product }) => (
          <div
            key={product.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <Link to={`/products/${product.slug}`}>
                <ResponsiveImage image={product.images[0]} width={400} height={300} alt={product.name} />
              </Link>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  showToast(`Removed ${product.name} from wishlist`, 'info');
                }}
                className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full text-slate-500 hover:text-rose-500 backdrop-blur-sm"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 hover:text-brand-600">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <Rating value={product.rating} count={product.reviewCount} size="sm" className="mt-1" />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {formatCurrency(product.price)}
                </span>
                <Button
                  onClick={() => handleMoveToCart(product)}
                  variant="primary"
                  size="sm"
                  leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                >
                  Move to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
