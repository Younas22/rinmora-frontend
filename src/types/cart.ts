export interface CartItemVariant {
  id: number;
  label: string;
}

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  variant: CartItemVariant | null;
  qty: number;
}

export interface CartValidateLine {
  product_id: number;
  variant_id?: number | null;
  qty: number;
}

export interface CartValidateResult {
  product_id: number;
  variant_id: number | null;
  name?: string;
  slug?: string;
  image_url?: string | null;
  price?: number;
  compare_at_price?: number | null;
  qty: number;
  quantity_available?: number;
  available: boolean;
  reason?: "not_found" | "out_of_stock" | null;
}
