import type {
  AccountSummary,
  Address,
  AddressPayload,
  PasswordUpdatePayload,
  ProfileUpdatePayload,
} from "@/types/account";
import type { AuthPayload, AuthUser } from "@/types/auth";
import type { CartValidateLine, CartValidateResult } from "@/types/cart";
import type {
  CheckoutOptions,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetail,
  UnavailableOrderItem,
} from "@/types/checkout";
import type {
  Category,
  HomePayload,
  Paginated,
  Product,
  ProductDetailPayload,
  ProductFilters,
  ReviewEligibility,
  ReviewSubmissionPayload,
} from "@/types/storefront";
import type { CmsPage, ContactFormPayload, Faq, FaqCategory, SeoMeta, SiteSettings } from "@/types/cms";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/rinmora/api";
const API_URL = /^https?:\/\//.test(RAW_API_URL) ? RAW_API_URL : `https://${RAW_API_URL}`;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
    public unavailableItems?: UnavailableOrderItem[]
  ) {
    super(message);
  }
}

async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }

  return res.json();
}

async function apiWrite<T>(method: "POST" | "PATCH" | "DELETE", path: string, payload?: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(body?.message ?? `Request failed (${res.status})`, res.status, body?.errors, body?.unavailable_items);
  }

  return body;
}

async function apiPost<T>(path: string, payload: unknown, token?: string): Promise<T> {
  return apiWrite<T>("POST", path, payload, token);
}

async function apiPatch<T>(path: string, payload: unknown, token?: string): Promise<T> {
  return apiWrite<T>("PATCH", path, payload, token);
}

async function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiWrite<T>("DELETE", path, undefined, token);
}

export async function getHomePayload(): Promise<HomePayload> {
  return apiGet<HomePayload>("/storefront/home");
}

export async function getCategories(): Promise<Category[]> {
  const body = await apiGet<{ data: Category[] }>("/storefront/categories");
  return body.data;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Paginated<Product>> {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.q) params.set("q", filters.q);
  if (filters.min_price !== undefined) params.set("min_price", String(filters.min_price));
  if (filters.max_price !== undefined) params.set("max_price", String(filters.max_price));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  params.set("per_page", String(filters.per_page ?? 12));

  return apiGet<Paginated<Product>>(`/storefront/products?${params.toString()}`);
}

export async function getProductBySlug(slug: string, reviewsPage = 1): Promise<ProductDetailPayload | null> {
  const res = await fetch(`${API_URL}/storefront/products/${slug}?reviews_page=${reviewsPage}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to load product ${slug} (${res.status})`);
  }

  return res.json();
}

export async function subscribeToNewsletter(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/storefront/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message ?? `Subscription failed (${res.status})`);
  }

  return body;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export async function registerCustomer(payload: RegisterPayload): Promise<AuthPayload> {
  return apiPost<AuthPayload>("/storefront/auth/register", payload);
}

export async function loginCustomer(email: string, password: string): Promise<AuthPayload> {
  return apiPost<AuthPayload>("/storefront/auth/login", { email, password });
}

export async function logoutCustomer(token: string): Promise<void> {
  await apiPost<{ message: string }>("/storefront/auth/logout", {}, token);
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/storefront/auth/me`, {
    cache: "no-store",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new ApiError("Session expired", res.status);
  }

  const body = await res.json();
  return body.data as AuthUser;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/storefront/auth/forgot-password", { email });
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/storefront/auth/reset-password", payload);
}

export async function validateCart(items: CartValidateLine[]): Promise<CartValidateResult[]> {
  const body = await apiPost<{ items: CartValidateResult[] }>("/storefront/cart/validate", { items });
  return body.items;
}

export async function getWishlist(token: string): Promise<Product[]> {
  const res = await fetch(`${API_URL}/storefront/wishlist`, {
    cache: "no-store",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new ApiError("Failed to load wishlist", res.status);
  }

  const body = await res.json();
  return body.data as Product[];
}

export async function toggleWishlist(productId: number, token: string): Promise<boolean> {
  const body = await apiPost<{ wishlisted: boolean }>(`/storefront/wishlist/${productId}`, {}, token);
  return body.wishlisted;
}

export async function mergeWishlist(productIds: number[], token: string): Promise<Product[]> {
  const body = await apiPost<{ data: Product[] }>("/storefront/wishlist/merge", { product_ids: productIds }, token);
  return body.data;
}

export async function getCheckoutOptions(): Promise<CheckoutOptions> {
  return apiGet<CheckoutOptions>("/storefront/checkout/options");
}

export async function createOrder(payload: CreateOrderPayload, token?: string): Promise<CreateOrderResponse> {
  return apiPost<CreateOrderResponse>("/storefront/orders", payload, token);
}

export async function getOrder(orderNumber: string, email?: string, token?: string): Promise<OrderDetail | null> {
  const params = email ? `?email=${encodeURIComponent(email)}` : "";
  const res = await fetch(`${API_URL}/storefront/orders/${orderNumber}${params}`, {
    cache: "no-store",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new ApiError("Failed to load order", res.status);
  }

  const body = await res.json();
  return body.data as OrderDetail;
}

export async function getAccountSummary(token: string): Promise<AccountSummary> {
  return apiGet<AccountSummary>("/storefront/account/summary", token);
}

export async function getAccountOrders(
  token: string,
  params: { status?: string; page?: number } = {}
): Promise<Paginated<OrderDetail>> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.page) search.set("page", String(params.page));
  return apiGet<Paginated<OrderDetail>>(`/storefront/account/orders?${search.toString()}`, token);
}

export async function getAccountOrder(token: string, orderNumber: string): Promise<OrderDetail | null> {
  const res = await fetch(`${API_URL}/storefront/account/orders/${orderNumber}`, {
    cache: "no-store",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new ApiError("Failed to load order", res.status);
  }

  const body = await res.json();
  return body.data as OrderDetail;
}

export async function getReviewEligibility(token: string, slug: string): Promise<ReviewEligibility> {
  return apiGet<ReviewEligibility>(`/storefront/products/${slug}/review-eligibility`, token);
}

export async function submitReview(
  token: string,
  payload: ReviewSubmissionPayload
): Promise<{ message: string; data: ReviewEligibility["existing_review"] }> {
  const form = new FormData();
  form.append("product_id", String(payload.product_id));
  form.append("rating", String(payload.rating));
  if (payload.title) form.append("title", payload.title);
  form.append("body", payload.body);
  if (payload.photo) form.append("photo", payload.photo);
  if (payload.remove_photo) form.append("remove_photo", "1");

  const res = await fetch(`${API_URL}/storefront/reviews`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: form,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(body?.message ?? `Request failed (${res.status})`, res.status, body?.errors);
  }

  return body;
}

export async function updateProfile(token: string, payload: ProfileUpdatePayload): Promise<AuthUser> {
  const body = await apiPatch<{ data: AuthUser }>("/storefront/account/profile", payload, token);
  return body.data;
}

export async function updatePassword(token: string, payload: PasswordUpdatePayload): Promise<{ message: string }> {
  return apiPatch<{ message: string }>("/storefront/account/password", payload, token);
}

export async function getAddresses(token: string): Promise<Address[]> {
  const body = await apiGet<{ data: Address[] }>("/storefront/account/addresses", token);
  return body.data;
}

export async function createAddress(token: string, payload: AddressPayload): Promise<Address> {
  const body = await apiPost<{ data: Address }>("/storefront/account/addresses", payload, token);
  return body.data;
}

export async function updateAddress(token: string, id: number, payload: AddressPayload): Promise<Address> {
  const body = await apiPatch<{ data: Address }>(`/storefront/account/addresses/${id}`, payload, token);
  return body.data;
}

export async function deleteAddress(token: string, id: number): Promise<void> {
  await apiDelete(`/storefront/account/addresses/${id}`, token);
}

export async function uploadPaymentProof(
  orderNumber: string,
  file: File,
  email?: string,
  token?: string
): Promise<string> {
  const form = new FormData();
  form.append("screenshot", file);
  if (email) form.append("email", email);

  const res = await fetch(`${API_URL}/storefront/orders/${orderNumber}/payment-proof`, {
    method: "POST",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(body?.message ?? `Upload failed (${res.status})`, res.status, body?.errors);
  }

  return body.proof_url as string;
}

export async function getPage(slug: string): Promise<CmsPage | null> {
  const res = await fetch(`${API_URL}/storefront/pages/${slug}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to load page ${slug} (${res.status})`);
  }

  const body = await res.json();
  return body.data as CmsPage;
}

export async function getFaqs(category?: FaqCategory): Promise<{ data: Faq[]; categories: FaqCategory[] }> {
  const params = category ? `?category=${category}` : "";
  return apiGet<{ data: Faq[]; categories: FaqCategory[] }>(`/storefront/faqs${params}`);
}

export async function submitContactForm(payload: ContactFormPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/storefront/contact", payload);
}

export async function getSeoMeta(path: string): Promise<SeoMeta | null> {
  const body = await apiGet<{ data: SeoMeta | null }>(`/storefront/seo?path=${encodeURIComponent(path)}`);
  return body.data;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const body = await apiGet<{ data: SiteSettings }>("/storefront/site-settings");
  return body.data;
}
