"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRipple } from "@/lib/ripple";
import { useCurrency } from "@/components/currency/CurrencyContext";
import { useCart } from "@/components/cart/CartContext";
import DragScrollRow from "./DragScrollRow";
import type { Reel } from "@/types/storefront";

const REEL_DURATION = 4500;

export default function ReelsAndViewer({ reels }: { reels: Reel[] }) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [open, setOpen] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reels[0]?.likes ?? 0);
  const [shareCopied, setShareCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const goToReel = useCallback(
    (index: number, slide = 0) => {
      const nextReel = (index + reels.length) % reels.length;
      const slideCount = reels[nextReel].slides.length || 1;
      setReelIndex(nextReel);
      setSlideIndex(((slide % slideCount) + slideCount) % slideCount);
      setLiked(false);
      setLikeCount(reels[nextReel].likes);
    },
    [reels]
  );

  const advanceSlide = useCallback(
    (delta: number) => {
      const slideCount = reels[reelIndex].slides.length || 1;
      const next = slideIndex + delta;

      if (next < 0) {
        const prevReel = (reelIndex - 1 + reels.length) % reels.length;
        goToReel(prevReel, reels[prevReel].slides.length - 1);
      } else if (next >= slideCount) {
        goToReel(reelIndex + 1, 0);
      } else {
        setSlideIndex(next);
      }
    },
    [reels, reelIndex, slideIndex, goToReel]
  );

  const openReel = (index: number) => {
    goToReel(index, 0);
    setOpen(true);
  };

  const closeReel = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => advanceSlide(1), REEL_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, reelIndex, slideIndex, advanceSlide]);

  useEffect(() => {
    if (open) return;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeReel();
      if (e.key === "ArrowLeft") advanceSlide(-1);
      if (e.key === "ArrowRight") advanceSlide(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, advanceSlide]);

  if (reels.length === 0) return null;

  const reel = reels[reelIndex];
  const slides = reel.slides.length > 0 ? reel.slides : [{ type: "image" as const, url: null }];
  const slide = slides[slideIndex];
  const prevReel = reels[(reelIndex - 1 + reels.length) % reels.length];
  const nextReel = reels[(reelIndex + 1) % reels.length];

  const avatarFor = (r: Reel) => r.avatar_url ?? `https://picsum.photos/seed/reel-${r.slug}/200/200`;
  const thumbFor = (r: Reel) => r.slides[0]?.url ?? `https://picsum.photos/seed/reel-media-${r.slug}/700/1200`;
  const slideUrl = slide.url ?? `https://picsum.photos/seed/reel-media-${reel.slug}-${slideIndex}/700/1200`;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/#reels`;
    const shareData = { title: reel.title, text: `Check out "${reel.title}" on Rinmora`, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the share sheet — nothing to do
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <>
      <section id="reels" className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-5 pb-2 md:pt-7 md:pb-3">
        <DragScrollRow className="flex gap-5 md:gap-8 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0 md:justify-center">
          {reels.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className="snap-item shrink-0 flex flex-col items-center gap-2"
              onClick={() => openReel(i)}
            >
              <span className="w-20 h-20 md:w-[5.75rem] md:h-[5.75rem] rounded-full p-[3px] bg-gradient-to-tr from-primary-dark via-primary to-[#6b3a53]">
                <span className="relative block w-full h-full rounded-full overflow-hidden ring-[3px] ring-white">
                  <Image src={avatarFor(r)} alt={`${r.title} reel`} fill sizes="92px" className="object-cover" />
                </span>
              </span>
              <p className="font-display text-xs font-medium text-center max-w-[5.5rem] leading-tight">{r.title}</p>
            </button>
          ))}
        </DragScrollRow>
      </section>

      <div
        className={`fixed inset-0 z-[80] bg-black transition-opacity duration-300 overflow-hidden ${
          open ? "opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <button
          aria-label="Close reel"
          onClick={closeReel}
          className="hidden md:grid absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white place-items-center shadow-card hover:bg-primary transition"
        >
          <i className="fa-solid fa-xmark text-base" />
        </button>

        <div className="w-full h-full flex items-center justify-center gap-3 lg:gap-4">
          <button
            aria-label="Open previous reel"
            onClick={() => goToReel(reelIndex - 1, 0)}
            className="hidden lg:block relative w-36 xl:w-44 h-[92vh] rounded-[1.75rem] overflow-hidden shrink-0 opacity-70 hover:opacity-100 transition"
          >
            <Image src={thumbFor(prevReel)} alt={prevReel.title} fill sizes="176px" className="object-cover" />
            <span className="absolute inset-0 bg-black/40" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/90">
              <Image src={avatarFor(prevReel)} alt={prevReel.title} fill sizes="36px" className="object-cover" />
            </span>
          </button>

          <div className="relative w-full h-full md:w-[430px] md:h-[94vh] shrink-0">
            <div className="relative w-full h-full md:rounded-[2rem] overflow-hidden bg-black">
              <div className="absolute top-0 inset-x-0 z-20 pt-3 pb-12 px-3 bg-gradient-to-b from-black/65 via-black/20 to-transparent md:bg-none md:pt-7">
                <div className="flex gap-1 mb-3">
                  {slides.map((_, i) => (
                    <ProgressBar
                      key={i}
                      state={i < slideIndex ? "done" : i === slideIndex ? "active" : "pending"}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 md:bg-black/30 md:backdrop-blur md:rounded-full md:pl-1.5 md:pr-3 md:py-1.5">
                    <span className="relative w-8 h-8 md:w-7 md:h-7 rounded-full overflow-hidden ring-2 ring-white/80 shrink-0">
                      <Image src={avatarFor(reel)} alt={reel.title} fill sizes="32px" className="object-cover" />
                    </span>
                    <p
                      className="text-white font-display text-sm md:text-xs font-semibold whitespace-nowrap truncate"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,.5)" }}
                    >
                      {reel.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <button
                        aria-label="Share"
                        onClick={handleShare}
                        className="w-9 h-9 rounded-full bg-black/35 backdrop-blur text-white md:bg-white/95 md:backdrop-blur-none md:text-ink grid place-items-center md:shadow hover:bg-black/50 md:hover:bg-primary transition"
                      >
                        <i className={`fa-solid ${shareCopied ? "fa-check" : "fa-share-nodes"} text-xs`} />
                      </button>
                      {shareCopied && (
                        <span className="absolute top-full mt-1.5 right-0 whitespace-nowrap bg-black/80 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                          Link copied!
                        </span>
                      )}
                    </div>
                    <button
                      aria-label="Toggle sound"
                      onClick={() => setMuted((v) => !v)}
                      className="w-9 h-9 rounded-full bg-black/35 backdrop-blur text-white md:bg-white/95 md:backdrop-blur-none md:text-ink grid place-items-center md:shadow hover:bg-black/50 md:hover:bg-primary transition"
                    >
                      <i className={`fa-solid ${muted ? "fa-volume-xmark" : "fa-volume-high"} text-xs`} />
                    </button>
                    <button
                      aria-label="Close reel"
                      onClick={closeReel}
                      className="md:hidden w-9 h-9 rounded-full bg-black/35 backdrop-blur text-white grid place-items-center hover:bg-black/50 transition"
                    >
                      <i className="fa-solid fa-xmark text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative w-full h-full">
                {slide.type === "video" ? (
                  <video
                    key={slideUrl}
                    ref={videoRef}
                    src={slideUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={muted}
                    playsInline
                  />
                ) : (
                  <Image
                    src={slideUrl}
                    alt={reel.title}
                    fill
                    sizes="(min-width: 768px) 430px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>

              <button
                aria-label="Previous slide"
                onClick={() => advanceSlide(-1)}
                className="md:hidden absolute left-0 top-0 w-1/3 h-full z-10"
              />
              <button
                aria-label="Next slide"
                onClick={() => advanceSlide(1)}
                className="md:hidden absolute right-0 top-0 w-1/3 h-full z-10"
              />

              <div className="absolute right-3 bottom-32 md:bottom-36 z-20 flex flex-col items-center gap-1">
                <button
                  aria-label="Like this reel"
                  onClick={() => {
                    setLiked((v) => !v);
                    setLikeCount((c) => (liked ? c - 1 : c + 1));
                  }}
                  className="w-11 h-11 rounded-full bg-white/95 grid place-items-center shadow-card hover:bg-primary transition"
                >
                  <i className={`${liked ? "fa-solid text-primary-dark" : "fa-regular"} fa-heart text-base`} />
                </button>
                <span
                  className="text-white text-xs font-display font-semibold"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,.6)" }}
                >
                  {likeCount}
                </span>
              </div>

              {reel.products.length > 0 && (
                <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-16 pb-5 px-3">
                  <DragScrollRow className="flex gap-3 overflow-x-auto snap-row">
                    {reel.products.map((p) => (
                      <a
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="snap-item shrink-0 w-60 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-card"
                      >
                        <span className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={p.image_url ?? `https://picsum.photos/seed/product-${p.id}/120/120`}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-xs font-semibold truncate">{p.name}</p>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="font-display font-semibold text-sm">{formatPrice(p.price)}</span>
                            {p.compare_at_price && p.compare_at_price > p.price && (
                              <span className="text-black/40 text-xs line-through">
                                {formatPrice(p.compare_at_price)}
                              </span>
                            )}
                          </div>
                          {p.discount_percent ? (
                            <span className="inline-block mt-0.5 text-[10px] font-semibold text-primary-dark">
                              {p.discount_percent}% OFF
                            </span>
                          ) : p.is_new ? (
                            <span className="inline-block mt-0.5 text-[10px] font-semibold text-primary-dark">
                              NEW
                            </span>
                          ) : null}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            createRipple(e);
                            addItem({
                              productId: p.id,
                              slug: p.slug,
                              name: p.name,
                              imageUrl: p.image_url,
                              price: p.price,
                              compareAtPrice: p.compare_at_price,
                              variant: null,
                            });
                          }}
                          className="btn-ripple shrink-0 bg-ink text-white text-[10px] font-display font-semibold tracking-wide uppercase px-3 py-2.5 rounded-full hover:bg-black/80 transition"
                        >
                          Add
                        </button>
                      </a>
                    ))}
                  </DragScrollRow>
                </div>
              )}
            </div>

            <button
              aria-label="Previous slide"
              onClick={() => advanceSlide(-1)}
              className="hidden md:grid absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-card place-items-center hover:bg-primary transition"
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => advanceSlide(1)}
              className="hidden md:grid absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-card place-items-center hover:bg-primary transition"
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>

          <button
            aria-label="Open next reel"
            onClick={() => goToReel(reelIndex + 1, 0)}
            className="hidden lg:block relative w-36 xl:w-44 h-[92vh] rounded-[1.75rem] overflow-hidden shrink-0 opacity-70 hover:opacity-100 transition"
          >
            <Image src={thumbFor(nextReel)} alt={nextReel.title} fill sizes="176px" className="object-cover" />
            <span className="absolute inset-0 bg-black/40" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/90">
              <Image src={avatarFor(nextReel)} alt={nextReel.title} fill sizes="36px" className="object-cover" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

function ProgressBar({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "active") {
    return <ActiveProgressBar />;
  }

  return (
    <div className="h-[3px] flex-1 rounded-full bg-white/30 overflow-hidden">
      <div className="h-full bg-white rounded-full" style={{ width: state === "done" ? "100%" : "0%" }} />
    </div>
  );
}

function ActiveProgressBar() {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="h-[3px] flex-1 rounded-full bg-white/30 overflow-hidden">
      <div
        className="h-full bg-white rounded-full"
        style={{ width: filled ? "100%" : "0%", transition: `width ${REEL_DURATION}ms linear` }}
      />
    </div>
  );
}
