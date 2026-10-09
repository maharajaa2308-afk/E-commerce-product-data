import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/features/cart/context/CartContext';
import { useWishlist } from '@/features/wishlist/context/WishlistContext';
import { DarkModeToggle } from '@/components/ui';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { CATEGORIES } from '@/lib/constants';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center">
          <div className="max-w-md p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              An unexpected error occurred in the application view.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-500/20"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Layout: React.FC = () => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Complimentary Express Shipping on Orders Over $150</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-slate-400">
              <span>Support 24/7</span>
              <span>100% Authentic Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Navigation Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-wider">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  AURA<span className="text-brand-500">.</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Catalog
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <NavLink
                to="/"
                className={({ isActive }: { isActive: boolean }) =>
                  `transition-colors hover:text-brand-500 ${
                    isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }: { isActive: boolean }) =>
                  `transition-colors hover:text-brand-500 ${
                    isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                Catalog
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }: { isActive: boolean }) =>
                  `transition-colors hover:text-brand-500 ${
                    isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                Saved Items
              </NavLink>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <DarkModeToggle />

              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={`Wishlist with ${totalWishlistItems} items`}
              >
                <Heart className="w-5 h-5" />
                {totalWishlistItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={`Cart with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md shadow-brand-500/30">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Nav */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-4 pb-6 space-y-3 animate-fade-in">
              <NavLink
                to="/"
                className={({ isActive }: { isActive: boolean }) =>
                  `block px-4 py-2.5 rounded-xl font-medium ${
                    isActive ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`
                }
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }: { isActive: boolean }) =>
                  `block px-4 py-2.5 rounded-xl font-medium ${
                    isActive ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`
                }
              >
                All Products
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }: { isActive: boolean }) =>
                  `block px-4 py-2.5 rounded-xl font-medium ${
                    isActive ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`
                }
              >
                Wishlist ({totalWishlistItems})
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }: { isActive: boolean }) =>
                  `block px-4 py-2.5 rounded-xl font-medium ${
                    isActive ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`
                }
              >
                Cart ({totalItems})
              </NavLink>
            </div>
          )}
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <CartDrawer />

        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800/80 py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Free Worldwide Express</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">On all orders over $150 with full tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">2-Year Official Warranty</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive hardware protection & repair</p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">30-Day Hassle-Free Returns</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No questions asked return policy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">A</div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">AURA Catalog</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Curating high-performance technology, precision wearables, and luxury lifestyle accessories. Designed for creators, audiophiles, and digital innovators.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">Categories</h5>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/products?category=${cat.id}`} className="hover:text-brand-500 transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">Quick Navigation</h5>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><Link to="/products" className="hover:text-brand-500 transition-colors">Catalog Grid</Link></li>
                <li><Link to="/cart" className="hover:text-brand-500 transition-colors">Your Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-brand-500 transition-colors">Saved Wishlist</Link></li>
                <li><Link to="/checkout" className="hover:text-brand-500 transition-colors">Checkout</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">Newsletter</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Subscribe for exclusive releases and tech drops.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} AURA Catalog Capstone Project. All rights reserved.</span>
              <div className="flex gap-6">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Cookie Preferences</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};
