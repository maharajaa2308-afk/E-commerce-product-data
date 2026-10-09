import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Layout';
import { CatalogSkeleton, ProductDetailSkeleton } from '@/components/ui/Skeleton';

// Lazy-loaded routes for code splitting
const HomePage = lazy(() => import('@/features/catalog/pages/HomePage').then((m) => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('@/features/catalog/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('@/features/product/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('@/features/cart/pages/CartPage').then((m) => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import('@/features/wishlist/pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import('@/features/checkout/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const GenericLoadingFallback: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
    <CatalogSkeleton />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<GenericLoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<GenericLoadingFallback />}>
            <CatalogPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:slug',
        element: (
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<GenericLoadingFallback />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <Suspense fallback={<GenericLoadingFallback />}>
            <WishlistPage />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<GenericLoadingFallback />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<GenericLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
