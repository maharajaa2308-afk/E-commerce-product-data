import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product, SortOption } from '@/types';
import { ProductCard } from '../components/ProductCard';
import { Button } from '@/components/ui';
import { CATEGORIES, SORT_OPTIONS, PRODUCTS_PER_PAGE, MAX_PRICE_RANGE } from '@/lib/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useMetaTags } from '@/hooks/useMetaTags';

const products = (productsData as unknown) as Product[];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useMetaTags({
    title: 'Product Catalog — Search & Filter Tech Gear',
    description: 'Browse all 24 high-performance tech products across audio, wearables, computing, photography, and gaming.',
  });

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const minPriceParam = Number(searchParams.get('minPrice')) || 0;
  const maxPriceParam = Number(searchParams.get('maxPrice')) || MAX_PRICE_RANGE;
  const minRatingParam = Number(searchParams.get('minRating')) || 0;
  const inStockOnlyParam = searchParams.get('inStock') === 'true';
  const sortByParam = (searchParams.get('sortBy') as SortOption) || 'featured';
  const pageParam = Number(searchParams.get('page')) || 1;

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 250);

  React.useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set('search', debouncedSearch);
        else next.delete('search');
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const updateParam = (key: string, value: string | number | boolean | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || value === '' || value === false || (key === 'category' && value === 'all')) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
        if (key !== 'page') next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (categoryParam !== 'all' && p.category !== categoryParam) return false;
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc && !matchTag) return false;
        }
        if (p.price < minPriceParam || p.price > maxPriceParam) return false;
        if (p.rating < minRatingParam) return false;
        if (inStockOnlyParam && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortByParam === 'price-asc') return a.price - b.price;
        if (sortByParam === 'price-desc') return b.price - a.price;
        if (sortByParam === 'rating') return b.rating - a.rating;
        if (sortByParam === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [categoryParam, debouncedSearch, minPriceParam, maxPriceParam, minRatingParam, inStockOnlyParam, sortByParam]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const hasActiveFilters = Boolean(
    searchParam || (categoryParam && categoryParam !== 'all') || minPriceParam > 0 || maxPriceParam < MAX_PRICE_RANGE || minRatingParam > 0 || inStockOnlyParam
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Product Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showing {filteredProducts.length} results across premium categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands, specs..."
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2"
            onClick={() => setMobileFilterOpen(true)}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex justify-between ${
                    categoryParam === 'all'
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-xs text-slate-400">{products.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  const isSelected = categoryParam === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex justify-between ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price Range</h4>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  ${minPriceParam} - ${maxPriceParam}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={MAX_PRICE_RANGE}
                step="50"
                value={maxPriceParam}
                onChange={(e) => updateParam('maxPrice', Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Minimum Rating</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => updateParam('minRating', ratingVal)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      minRatingParam === ratingVal
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {ratingVal === 0 ? 'All' : `${ratingVal}★+`}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnlyParam}
                  onChange={(e) => updateParam('inStock', e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Sort & Active Filters:</span>
              {categoryParam !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-full">
                  Category: {CATEGORIES.find((c) => c.id === categoryParam)?.name}
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateParam('category', 'all')} />
                </span>
              )}
              {maxPriceParam < MAX_PRICE_RANGE && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-full">
                  Under ${maxPriceParam}
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateParam('maxPrice', MAX_PRICE_RANGE)} />
                </span>
              )}
              {minRatingParam > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-full">
                  {minRatingParam}★ & Above
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateParam('minRating', 0)} />
                </span>
              )}
              {inStockOnlyParam && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-full">
                  In Stock Only
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => updateParam('inStock', false)} />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-xs font-bold text-slate-500 dark:text-slate-400">Sort:</label>
              <select
                id="sort-by"
                value={sortByParam}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No products match your criteria</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try adjusting your search terms or clearing price and category filters.
              </p>
              <Button onClick={clearAllFilters} variant="primary" size="sm">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', currentPage - 1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateParam('page', currentPage + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Filter Products</h3>
                <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { updateParam('category', 'all'); setMobileFilterOpen(false); }}
                    className="w-full text-left py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { updateParam('category', cat.id); setMobileFilterOpen(false); }}
                      className="w-full text-left py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
