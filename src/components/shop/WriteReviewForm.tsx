"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { ApiError, getReviewEligibility, submitReview } from "@/lib/api";
import type { MyReview } from "@/types/storefront";

export default function WriteReviewForm({ productId, slug }: { productId: number; slug: string }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState<MyReview | null>(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await getReviewEligibility(token, slug);
        if (cancelled) return;
        setCanReview(result.can_review);
        setExistingReview(result.existing_review);
        if (result.existing_review) {
          setRating(result.existing_review.rating);
          setTitle(result.existing_review.title ?? "");
          setBody(result.existing_review.body);
          setPhotoPreview(result.existing_review.photo_url);
        }
      } catch {
        if (!cancelled) setCanReview(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, slug]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setRemovePhoto(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await submitReview(token, {
        product_id: productId,
        rating,
        title: title || undefined,
        body,
        photo: photoFile ?? undefined,
        remove_photo: removePhoto,
      });
      setSuccess(result.message);
      if (result.data) {
        setExistingReview(result.data);
        setPhotoPreview(result.data.photo_url);
      }
      setPhotoFile(null);
      setRemovePhoto(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  if (!token) {
    return (
      <div className="bg-black/[0.02] rounded-3xl p-6 md:p-7 text-sm text-black/60">
        <Link href="/login" className="text-primary-dark font-semibold hover:underline">
          Sign in
        </Link>{" "}
        to write a review — only customers with a delivered order for this product can review it.
      </div>
    );
  }

  if (!canReview) {
    return null;
  }

  return (
    <div className="bg-black/[0.02] rounded-3xl p-6 md:p-7">
      <h3 className="font-display font-semibold text-sm mb-1">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>
      {existingReview && (
        <p className="text-xs text-black/45 mb-4">
          Status: <span className="capitalize">{existingReview.status}</span>. Resubmitting will send it back for
          approval.
        </p>
      )}

      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
          {success}
        </p>
      )}
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-display font-medium text-black/50 mb-2">Your Rating</label>
          <div className="flex gap-1 text-2xl text-primary-dark">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                className="leading-none"
              >
                {(hoverRating || rating) >= value ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="reviewTitle" className="block text-xs font-display font-medium text-black/50 mb-2">
            Title (optional)
          </label>
          <input
            id="reviewTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <div>
          <label htmlFor="reviewBody" className="block text-xs font-display font-medium text-black/50 mb-2">
            Your Review
          </label>
          <textarea
            id="reviewBody"
            rows={4}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you like or dislike?"
            className="w-full px-5 py-4 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-black/50 mb-2">
            Add a Photo (optional)
          </label>
          {photoPreview ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Review photo preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs font-display font-semibold uppercase tracking-wide text-black/50 hover:text-ink underline underline-offset-4 transition"
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-wide border border-black/10 rounded-full px-5 py-3 hover:bg-black/5 transition"
            >
              <i className="fa-solid fa-camera" /> Upload a photo, e.g. of the parcel you received
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-9 py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
        >
          {submitting ? "Submitting…" : existingReview ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
