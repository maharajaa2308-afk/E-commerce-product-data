import { CategoryId, SortOption } from '@/types';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'audio', name: 'Audio & Sound', description: 'Headphones, earbuds, & speakers', iconName: 'Headphones' },
  { id: 'wearables', name: 'Wearables', description: 'Smartwatches & health trackers', iconName: 'Watch' },
  { id: 'computers', name: 'Computing', description: 'Laptops, keyboards, & peripherals', iconName: 'Laptop' },
  { id: 'photography', name: 'Photography', description: 'Cameras, lenses, & drones', iconName: 'Camera' },
  { id: 'gaming', name: 'Gaming', description: 'Monitors, controllers, & gear', iconName: 'Gamepad2' },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
];

export const PRODUCTS_PER_PAGE = 8;
export const MAX_PRICE_RANGE = 2500;
