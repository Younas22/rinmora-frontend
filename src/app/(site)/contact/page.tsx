import type { Metadata } from "next";
import ContactForm from "@/components/pages/ContactForm";
import { getSiteSettings } from "@/lib/api";
import type { BusinessHours, SocialLink } from "@/types/cms";

export const metadata: Metadata = {
  title: "Contact Us — Rinmora",
  description: "Get in touch with the Rinmora team.",
};

const DAY_LABELS: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function formatBusinessHours(hours: BusinessHours): string[] {
  const lines: string[] = [];
  let groupStart = 0;

  for (let i = 0; i <= DAY_ORDER.length; i++) {
    const prev = hours[DAY_ORDER[i - 1]];
    const curr = i < DAY_ORDER.length ? hours[DAY_ORDER[i]] : null;
    const sameAsPrev = prev && curr && prev.open === curr.open && prev.from === curr.from && prev.to === curr.to;

    if (!sameAsPrev) {
      if (i > groupStart) {
        const first = DAY_LABELS[DAY_ORDER[groupStart]];
        const last = DAY_LABELS[DAY_ORDER[i - 1]];
        const label = groupStart === i - 1 ? first : `${first} – ${last}`;
        lines.push(prev?.open ? `${label}: ${prev.from} – ${prev.to}` : `${label}: Closed`);
      }
      groupStart = i;
    }
  }

  return lines;
}

const SOCIAL_ICONS: Record<SocialLink["platform"], string> = {
  facebook: "fa-brands fa-facebook-f",
  instagram: "fa-brands fa-instagram",
  tiktok: "fa-brands fa-tiktok",
  pinterest: "fa-brands fa-pinterest",
  youtube: "fa-brands fa-youtube",
  linkedin: "fa-brands fa-linkedin-in",
  twitter: "fa-brands fa-x-twitter",
  whatsapp: "fa-brands fa-whatsapp",
};

const FALLBACK_SOCIAL: SocialLink[] = [
  { platform: "instagram", url: "#" },
  { platform: "facebook", url: "#" },
  { platform: "tiktok", url: "#" },
];

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null);
  const store = settings?.store;
  const socialLinks = settings?.social && settings.social.length > 0 ? settings.social : FALLBACK_SOCIAL;
  const hoursLines = store?.hours ? formatBusinessHours(store.hours) : [];

  return (
    <main className="pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 text-center">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mt-3">We&apos;d Love to Hear From You</h1>
          <p className="text-black/50 text-sm md:text-base mt-3">
            Questions about an order, a product, or just want to say hello? Our team typically replies within 24
            hours.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
          <ContactForm />

          <div className="space-y-5">
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-display font-semibold text-sm mb-5">Store Information</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-envelope text-primary-dark mt-0.5" />
                  <span className="text-black/65">{store?.support_email || store?.email || "support@rinmora.com"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-phone text-primary-dark mt-0.5" />
                  <span className="text-black/65">{store?.support_phone || store?.phone || "+1 (555) 012-3456"}</span>
                </li>
                {hoursLines.length > 0 ? (
                  hoursLines.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <i className="fa-regular fa-clock text-primary-dark mt-0.5" />
                      <span className="text-black/65">{line}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-3">
                    <i className="fa-regular fa-clock text-primary-dark mt-0.5" />
                    <span className="text-black/65">Mon – Sat: 9:00 AM – 7:00 PM</span>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-location-dot text-primary-dark mt-0.5" />
                  <span className="text-black/65">{store?.address || "123 Rodeo Drive, Los Angeles, CA 90001"}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-display font-semibold text-sm mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target={link.url === "#" ? undefined : "_blank"}
                    rel={link.url === "#" ? undefined : "noopener noreferrer"}
                    aria-label={link.platform}
                    className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
                  >
                    <i className={SOCIAL_ICONS[link.platform]} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-primary/15 rounded-3xl p-6">
              <h3 className="font-display font-semibold text-sm mb-3">Quick Answers</h3>
              <ul className="space-y-2 text-sm text-black/65">
                <li>
                  <a href="/faq" className="hover:text-ink transition inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right text-[10px]" /> Where is my order?
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:text-ink transition inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right text-[10px]" /> How do I return an item?
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-ink transition inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right text-[10px]" /> What payment methods do you accept?
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
