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

export interface SocialLink {
  platform: "facebook" | "instagram" | "tiktok" | "pinterest" | "youtube" | "linkedin" | "twitter" | "whatsapp";
  url: string;
}

export interface BusinessHours {
  [day: string]: { open: boolean; from: string; to: string };
}

export interface SiteSettings {
  branding: {
    logo_url: string | null;
    dark_logo_url: string | null;
    mobile_logo_url: string | null;
    favicon_url: string | null;
  };
  social: SocialLink[];
  store: {
    name: string | null;
    phone: string | null;
    email: string | null;
    support_phone: string | null;
    support_email: string | null;
    address: string | null;
    description: string | null;
    hours: BusinessHours | null;
  };
}
