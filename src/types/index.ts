export interface ProductImage {
  thumbnail: string; // 400w
  medium: string;    // 800w
  large: string;     // 1200w
  alt: string;
}

export type CategoryId = 'audio' | 'wearables' | 'computers' | 'photography' | 'gaming';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  category: CategoryId;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  images: ProductImage[];
  specifications: Record<string, string>;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
  page: number;
}
