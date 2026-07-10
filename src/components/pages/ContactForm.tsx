"use client";

import { useState, type FormEvent } from "react";
import { ApiError, submitContactForm } from "@/lib/api";

const SUBJECTS = ["Order Inquiry", "Product Question", "Returns & Exchanges", "Wholesale Inquiry", "Something Else"];

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await submitContactForm({
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone: phone || undefined,
        subject,
        message,
      });
      setSuccess(result.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSubject(SUBJECTS[0]);
      setMessage("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 md:p-9">
      <h2 className="font-display text-lg font-semibold mb-6">Send Us a Message</h2>

      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
          {success}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cFirstName" className="block text-xs font-display font-medium text-black/50 mb-2">
              First Name
            </label>
            <input
              id="cFirstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Sana"
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label htmlFor="cLastName" className="block text-xs font-display font-medium text-black/50 mb-2">
              Last Name
            </label>
            <input
              id="cLastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Khan"
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cEmail" className="block text-xs font-display font-medium text-black/50 mb-2">
              Email Address
            </label>
            <input
              id="cEmail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label htmlFor="cPhone" className="block text-xs font-display font-medium text-black/50 mb-2">
              Phone Number
            </label>
            <input
              id="cPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>
        <div>
          <label htmlFor="cSubject" className="block text-xs font-display font-medium text-black/50 mb-2">
            Subject
          </label>
          <div className="relative">
            <select
              id="cSubject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full appearance-none px-5 py-3.5 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down text-[10px] absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-black/40" />
          </div>
        </div>
        <div>
          <label htmlFor="cMessage" className="block text-xs font-display font-medium text-black/50 mb-2">
            Message
          </label>
          <textarea
            id="cMessage"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us how we can help..."
            className="w-full px-5 py-4 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-9 py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
