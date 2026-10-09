import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus, Share2 } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/formatters';
import { Button, Rating, Badge, ResponsiveImage, useToast } from '@/components/ui';
import { useCart } from '@/features/cart/context/CartContext';
import { useWishlist } from '@/features/wishlist/context/WishlistContext';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { useMetaTags } from '@/hooks/useMetaTags';

const products = (productsData as unknown) as Product[];

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, items, setIsCartDrawerOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const product = products.find((p) => p.slug === slug);

  useMetaTags({
    title: product ? `${product.name} — ${product.brand}` : 'Product Detail',
    description: product?.description,
    ogTitle: product?.name,
    ogDescription: product?.description,
    ogImage: product?.images[0]?.medium,
  });

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Product Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The product slug you are trying to access does not exist or has been removed.
        </p>
        <Button onClick={() => navigate('/products')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const cartItem = items.find((item) => item.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const discountPct = calculateDiscountPercentage(product.price, product.originalPrice);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${product.name} to cart`, 'success');
    setIsCartDrawerOpen(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      isWishlisted ? `Removed ${product.name} from wishlist` : `Saved ${product.name} to wishlist`,
      isWishlisted ? 'info' : 'success'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-lg">
            <ResponsiveImage
              image={product.images[selectedImageIndex] || product.images[0]}
              width={1200}
              height={900}
              priority={true}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPct && (
              <div className="absolute top-4 left-4">
                <Badge variant="accent" size="md">-{discountPct}% OFF</Badge>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-brand-600 ring-2 ring-brand-500/30 scale-95'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ResponsiveImage image={img} width={80} height={80} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {product.brand} • {product.category}
              </span>
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 pt-1">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Currently Out of Stock'}
              </span>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {discountPct && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Save {formatCurrency(product.originalPrice! - product.price)}
              </span>
            )}
          </div>

          <div className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{product.fullDescription}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-slate-400">Quantity:</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-xl disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-xl disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                leftIcon={inCartQty > 0 ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : inCartQty > 0
                  ? `Add More (${inCartQty} in cart)`
                  : 'Add to Cart'}
              </Button>

              <button
                onClick={handleToggleWishlist}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isWishlisted
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col items-center space-y-1">
              <Truck className="w-4 h-4 text-brand-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Express Delivery</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col items-center space-y-1">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">2-Year Warranty</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col items-center space-y-1">
              <RotateCcw className="w-4 h-4 text-brand-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">30-Day Return</span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Technical Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, val]) => (
            <div
              key={key}
              className="flex justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm"
            >
              <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
              <span className="font-bold text-slate-900 dark:text-white">{val}</span>
            </div>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Recommendations
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Related Products in {product.category}
              </h3>
            </div>
            <Link to={`/products?category=${product.category}`} className="text-xs font-bold text-brand-600 hover:underline">
              View Category
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
