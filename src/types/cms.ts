export interface CmsPage {
  name: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  updated_at: string | null;
}

export type FaqCategory = "orders" | "shipping" | "returns" | "payments" | "products" | "account";

export interface Faq {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface SeoMeta {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  twitter_card_type: string | null;
  schema_type: string | null;
  schema_json: string | null;
}
