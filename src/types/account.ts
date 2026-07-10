import type { AuthUser } from "@/types/auth";
import type { OrderDetail } from "@/types/checkout";

export interface Address {
  id: number;
  type: "shipping" | "billing";
  recipient_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  zip: string | null;
  country: string;
  is_default: boolean;
}

export interface AddressPayload {
  type: "shipping" | "billing";
  recipient_name: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  zip?: string;
  country: string;
  is_default?: boolean;
}

export interface AccountCounts {
  orders_total: number;
  orders_pending: number;
  wishlist_count: number;
  addresses_count: number;
}

export interface AccountSummary {
  profile: AuthUser;
  counts: AccountCounts;
  reward_points: number;
  recent_orders: OrderDetail[];
}

export interface ProfileUpdatePayload {
  first_name: string;
  last_name: string;
  phone?: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
}

export interface PasswordUpdatePayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}
