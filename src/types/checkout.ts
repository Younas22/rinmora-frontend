export interface PaymentMethodOption {
  code: "cod" | "bank_transfer";
  name: string;
}

export interface CheckoutBankAccount {
  id: number;
  bank_name: string;
  account_title: string;
  account_number: string;
  iban: string | null;
}

export interface ShippingMethodOption {
  id: number;
  zone_name: string;
  name: string;
  delivery_time: string;
  rate: number;
}

export interface CheckoutOptions {
  payment_methods: PaymentMethodOption[];
  bank_accounts: CheckoutBankAccount[];
  shipping_methods: ShippingMethodOption[];
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country: string;
  shipping_phone?: string;
  billing_same_as_shipping: boolean;
  billing_name?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  billing_phone?: string;
  shipping_method_id: number;
  payment_method: "cod" | "bank_transfer";
  note?: string;
  items: { product_id: number; variant_id?: number | null; qty: number }[];
}

export interface CreateOrderResponse {
  order_number: string;
  total: number;
}

export interface UnavailableOrderItem {
  product_id: number;
  variant_id: number | null;
  reason: "not_found" | "out_of_stock";
}

export interface OrderDetail {
  order_number: string;
  status: string;
  payment_status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  shipping_address: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    zip: string | null;
    country: string;
    phone: string | null;
  };
  items: {
    product_id: number | null;
    variant_id: number | null;
    product_name: string;
    product_slug: string | null;
    variant_label: string | null;
    image_url: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
    already_reviewed: boolean;
  }[];
  events?: {
    title: string;
    description: string | null;
    created_at: string;
  }[];
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  payment: {
    method: string | null;
    method_name: string | null;
    status: string;
    proof_url: string | null;
  } | null;
}
