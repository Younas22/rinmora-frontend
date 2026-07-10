export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  products_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  discount_percent: number | null;
  is_featured: boolean;
  is_new: boolean;
  stock_status: string;
  rating: number | null;
  reviews_count: number;
  category: { id: number; name: string; slug: string } | null;
  image_url: string | null;
}

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string;
  product: { id: number; name: string; slug: string } | null;
  created_at: string | null;
}

export interface ReelProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  compare_at_price: number | null;
  discount_percent: number | null;
  is_new: boolean;
}

export interface ReelSlide {
  type: "image" | "video";
  url: string | null;
}

export interface Reel {
  id: number;
  title: string;
  slug: string;
  avatar_url: string | null;
  slides: ReelSlide[];
  likes: number;
  products: ReelProduct[];
}

export type HomepageSectionType =
  | "hero_slider"
  | "featured_categories"
  | "best_sellers"
  | "promotional_banner"
  | "testimonials"
  | "newsletter"
  | "custom_html";

export interface LayoutSection {
  type: HomepageSectionType;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
}

export interface HomePayload {
  layout: LayoutSection[];
  categories: Category[];
  bestsellers: Product[];
  reels: Reel[];
  reviews: Review[];
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProductImage {
  id: number;
  url: string;
  thumb_url: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  label: string;
  price: number | null;
  quantity: number;
  option_values: Record<string, string>;
}

export interface ProductDetail extends Product {
  sku: string;
  description: string | null;
  quantity: number;
  brand: { id: number; name: string } | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductDetailPayload {
  product: ProductDetail;
  reviews: Paginated<Review>;
  related_products: Product[];
}

export type ProductSort = "latest" | "price_asc" | "price_desc" | "popular";

export interface ProductFilters {
  category?: string;
  q?: string;
  min_price?: number;
  max_price?: number;
  sort?: ProductSort;
  page?: number;
  per_page?: number;
}
