import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { getSiteSettings } from "@/lib/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <>
      <SiteHeader logoUrl={settings?.branding.logo_url} />
      {children}
      <SiteFooter socialLinks={settings?.social} logoUrl={settings?.branding.logo_url} />
    </>
  );
}
