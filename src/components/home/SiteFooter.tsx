export default function SiteFooter() {
  return (
    <footer className="border-t border-black/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-01.png" alt="Rinmora" className="h-12 w-auto mb-4" />
            <p className="text-black/50 text-sm max-w-xs">
              Premium handbags designed for confident women. Elegance you can carry, every day.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
              >
                <i className="fa-brands fa-tiktok" />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Quick Links"
            links={[
              { label: "Shop All", href: "/shop" },
              { label: "Categories", href: "/categories" },
              { label: "New Arrivals", href: "/shop?sort=latest" },
            ]}
          />
          <FooterColumn
            title="Customer Support"
            links={[
              { label: "Contact Us", href: "/contact" },
              { label: "FAQs", href: "/faq" },
              { label: "Track Order", href: "/account/orders" },
              { label: "Returns & Refunds", href: "/returns" },
            ]}
          />
          <FooterColumn
            title="Policies"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Return Policy", href: "/returns" },
            ]}
          />
        </div>

        <div className="border-t border-black/5 mt-12 pt-6 text-center text-xs text-black/40">
          &copy; {new Date().getFullYear()} Rinmora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-display font-semibold text-sm mb-4 uppercase tracking-wide">{title}</h3>
      <ul className="space-y-3 text-sm text-black/55">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="hover:text-ink transition">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
