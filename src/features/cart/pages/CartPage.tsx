import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { Button, ResponsiveImage, useToast } from '@/components/ui';
import { useMetaTags } from '@/hooks/useMetaTags';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useMetaTags({
    title: 'Shopping Cart',
    description: 'Review items in your cart and calculate checkout total.',
  });

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AURA10') {
      setPromoApplied(true);
      showToast('10% Promo Code AURA10 applied successfully!', 'success');
    } else {
      showToast('Invalid promo code. Use AURA10 for 10% off.', 'error');
    }
  };

  const shippingCost = subtotal > 150 ? 0 : 15;
  const discountAmount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Looks like you haven't added any premium gear to your cart yet.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {items.reduce((acc, i) => acc + i.quantity, 0)} items reserved in your session
          </p>
        </div>

        <button
          onClick={() => {
            clearCart();
            showToast('Cleared all items from cart', 'info');
          }}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Clear Shopping Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                <ResponsiveImage image={product.images[0]} width={96} height={96} alt={product.name} />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white hover:text-brand-600">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Unit Price: {formatCurrency(product.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <span className="block font-black text-base text-slate-900 dark:text-white">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center">
            <Link to="/products">
              <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl space-y-6 shadow-sm sticky top-28">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
            Order Summary
          </h2>

          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Promo Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Try AURA10"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Apply
              </Button>
            </div>
            {promoApplied && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 10% Discount Applied!
              </p>
            )}
          </form>

          <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Discount (10%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>Total</span>
              <span className="text-brand-600 dark:text-brand-400">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <Link to="/checkout" className="block w-full">
            <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
