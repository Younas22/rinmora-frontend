import type { Metadata } from "next";
import { Poppins, Manrope } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthContext";
import { CartProvider } from "@/components/cart/CartContext";
import CartToast from "@/components/cart/CartToast";
import { WishlistProvider } from "@/components/wishlist/WishlistContext";
import { QuickViewProvider } from "@/components/shop/QuickViewContext";
import QuickViewModal from "@/components/shop/QuickViewModal";
import { getSiteSettings } from "@/lib/api";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: "Rinmora — Elegance You Can Carry",
      template: "%s",
    },
    description: "Rinmora — Premium handbags designed for confident women.",
    icons: settings?.branding.favicon_url ? { icon: settings.branding.favicon_url } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-white text-ink antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <QuickViewProvider>
                {children}
                <QuickViewModal />
                <CartToast />
              </QuickViewProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
