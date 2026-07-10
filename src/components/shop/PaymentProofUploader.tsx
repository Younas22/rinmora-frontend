"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ApiError, getCheckoutOptions, uploadPaymentProof } from "@/lib/api";
import { createRipple } from "@/lib/ripple";
import type { CheckoutBankAccount } from "@/types/checkout";

export default function PaymentProofUploader({
  orderNumber,
  initialProofUrl,
  email,
  token,
}: {
  orderNumber: string;
  initialProofUrl: string | null;
  email?: string;
  token?: string;
}) {
  const [bankAccounts, setBankAccounts] = useState<CheckoutBankAccount[]>([]);
  const [proofUrl, setProofUrl] = useState<string | null>(initialProofUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getCheckoutOptions()
      .then((opts) => setBankAccounts(opts.bank_accounts))
      .catch(() => {});
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      const url = await uploadPaymentProof(orderNumber, file, email, token);
      setProofUrl(url);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 md:p-8 text-left">
      <h2 className="font-display text-lg font-semibold mb-4">Complete Your Bank Transfer</h2>

      {bankAccounts.length > 0 && (
        <div className="space-y-4 mb-6">
          {bankAccounts.map((account) => (
            <div key={account.id} className="bg-black/[0.02] rounded-2xl p-5 text-sm">
              <p className="font-display font-semibold mb-1">{account.bank_name}</p>
              <p className="text-black/60">Account Title: {account.account_title}</p>
              <p className="text-black/60">Account Number: {account.account_number}</p>
              {account.iban && <p className="text-black/60">IBAN: {account.iban}</p>}
            </div>
          ))}
        </div>
      )}

      {proofUrl ? (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proofUrl} alt="Payment proof" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">
              <i className="fa-solid fa-circle-check mr-1.5" /> Payment screenshot uploaded
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-display font-semibold uppercase tracking-wide text-black/50 hover:text-ink underline underline-offset-4 transition mt-1"
            >
              Upload a different screenshot
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-black/50 text-sm mb-4">
            After transferring the total amount, upload a screenshot of your payment receipt so we can verify it.
          </p>
          <button
            type="button"
            onClick={(e) => {
              createRipple(e);
              fileInputRef.current?.click();
            }}
            disabled={uploading}
            className="btn-ripple bg-ink text-white font-display font-semibold text-sm uppercase tracking-wide px-6 py-3.5 rounded-full hover:bg-black/80 transition disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload Payment Screenshot"}
          </button>
          {uploadError && <p className="text-red-600 text-sm mt-3">{uploadError}</p>}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
