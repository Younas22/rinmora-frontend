const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_URL = /^https?:\/\//.test(RAW_SITE_URL) ? RAW_SITE_URL : `https://${RAW_SITE_URL}`;
