import { getHomePayload } from "@/lib/api";
import ReelsAndViewer from "@/components/home/ReelsAndViewer";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoriesSection from "@/components/home/CategoriesSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import PromoBanner from "@/components/home/PromoBanner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ReviewsSection from "@/components/home/ReviewsSection";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";
import type { HomepageSectionType } from "@/types/storefront";

export default async function Home() {
  const { layout, categories, bestsellers, reels, reviews } = await getHomePayload();

  const section = (type: HomepageSectionType) => layout.find((s) => s.type === type);
  const isVisible = (type: HomepageSectionType) => layout.length === 0 || Boolean(section(type));

  const heroSection = section("hero_slider");
  const promoSection = section("promotional_banner");

  return (
    <>
      <main className="pt-16 md:pt-20">
        <ReelsAndViewer reels={reels} />
        {isVisible("hero_slider") && (
          <Hero
            eyebrow={heroSection?.subtitle}
            heading={heroSection?.title}
            description={heroSection?.content}
            image={heroSection?.image_url}
            ctaText={heroSection?.button_text}
            ctaLink={heroSection?.button_link}
          />
        )}
        <TrustBar />
        {isVisible("featured_categories") && <CategoriesSection categories={categories} />}
        {isVisible("best_sellers") && <BestSellersSection products={bestsellers} />}
        {isVisible("promotional_banner") && (
          <PromoBanner
            eyebrow={promoSection?.subtitle}
            heading={promoSection?.title}
            description={promoSection?.content}
            image={promoSection?.image_url}
            ctaText={promoSection?.button_text}
            ctaLink={promoSection?.button_link}
          />
        )}
        <WhyChooseUs />
        {isVisible("testimonials") && <ReviewsSection reviews={reviews} />}
        <InstagramGallery />
        {isVisible("newsletter") && <Newsletter />}
      </main>
    </>
  );
}
