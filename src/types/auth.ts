export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}
