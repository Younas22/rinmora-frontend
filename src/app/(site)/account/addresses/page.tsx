"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { ApiError, createAddress, deleteAddress, getAddresses, updateAddress } from "@/lib/api";
import type { Address, AddressPayload } from "@/types/account";

const EMPTY_FORM: AddressPayload = {
  type: "shipping",
  recipient_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  is_default: false,
};

export default function AccountAddressesPage() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = () => {
    if (!token) return;
    getAddresses(token).then(setAddresses);
  };

  useEffect(loadAddresses, [token]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingId(address.id);
    setForm({
      type: address.type,
      recipient_name: address.recipient_name,
      phone: address.phone ?? "",
      address_line1: address.address_line1,
      address_line2: address.address_line2 ?? "",
      city: address.city,
      state: address.state ?? "",
      zip: address.zip ?? "",
      country: address.country,
      is_default: address.is_default,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        await updateAddress(token, editingId, form);
      } else {
        await createAddress(token, form);
      }
      setModalOpen(false);
      loadAddresses();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Delete this address?")) return;
    await deleteAddress(token, id);
    loadAddresses();
  };

  return (
    <>
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-black/45 mb-4">
          <Link href="/account" className="hover:text-ink transition">
            My Account
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <span className="text-ink font-medium">Addresses</span>
        </nav>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Saved Addresses</h1>
        <p className="text-black/50 text-sm mt-2">Manage the addresses used for shipping and billing at checkout.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {addresses?.map((address) => (
          <div key={address.id} className="bg-white rounded-3xl shadow-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {address.is_default && (
                  <span className="bg-primary/25 text-ink text-[10px] font-display font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    Default
                  </span>
                )}
                <span className="text-black/40 text-[10px] font-display font-semibold uppercase tracking-wide">
                  {address.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openEditModal(address)}
                  aria-label="Edit address"
                  className="text-black/40 hover:text-ink transition text-sm"
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  aria-label="Delete address"
                  className="text-black/40 hover:text-red-600 transition text-sm"
                >
                  <i className="fa-solid fa-trash-can" />
                </button>
              </div>
            </div>
            <p className="font-display text-sm font-semibold">{address.recipient_name}</p>
            <p className="text-black/55 text-sm mt-1 leading-relaxed">
              {address.address_line1}
              {address.address_line2 ? `, ${address.address_line2}` : ""}
              <br />
              {address.city}
              {address.state ? `, ${address.state}` : ""} {address.zip ?? ""}, {address.country}
            </p>
            {address.phone && <p className="text-black/45 text-xs mt-2">{address.phone}</p>}
          </div>
        ))}

        <button
          type="button"
          onClick={openAddModal}
          className="bg-white rounded-3xl shadow-card p-6 flex flex-col items-center justify-center gap-3 text-black/50 hover:text-ink hover:bg-black/[0.02] transition min-h-[160px]"
        >
          <span className="w-10 h-10 rounded-full border border-black/15 grid place-items-center">
            <i className="fa-solid fa-plus" />
          </span>
          <span className="font-display text-sm font-semibold">Add New Address</span>
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-soft w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-base">{editingId ? "Edit Address" : "Add New Address"}</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full grid place-items-center hover:bg-black/5 transition"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">{error}</p>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={form.type === "shipping"}
                    onChange={() => setForm((f) => ({ ...f, type: "shipping" }))}
                  />
                  Shipping
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={form.type === "billing"}
                    onChange={() => setForm((f) => ({ ...f, type: "billing" }))}
                  />
                  Billing
                </label>
              </div>

              <div>
                <label htmlFor="addrRecipientName" className="block text-sm font-medium mb-1.5">
                  Recipient Name
                </label>
                <input
                  id="addrRecipientName"
                  type="text"
                  required
                  value={form.recipient_name}
                  onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="addrPhone" className="block text-sm font-medium mb-1.5">
                  Phone
                </label>
                <input
                  id="addrPhone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="addrLine1" className="block text-sm font-medium mb-1.5">
                  Address Line 1
                </label>
                <input
                  id="addrLine1"
                  type="text"
                  required
                  value={form.address_line1}
                  onChange={(e) => setForm((f) => ({ ...f, address_line1: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="addrLine2" className="block text-sm font-medium mb-1.5">
                  Address Line 2 (Optional)
                </label>
                <input
                  id="addrLine2"
                  type="text"
                  value={form.address_line2}
                  onChange={(e) => setForm((f) => ({ ...f, address_line2: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="addrCity" className="block text-sm font-medium mb-1.5">
                    City
                  </label>
                  <input
                    id="addrCity"
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="addrState" className="block text-sm font-medium mb-1.5">
                    State / Province
                  </label>
                  <input
                    id="addrState"
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="addrZip" className="block text-sm font-medium mb-1.5">
                    ZIP / Postal Code
                  </label>
                  <input
                    id="addrZip"
                    type="text"
                    value={form.zip}
                    onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="addrCountry" className="block text-sm font-medium mb-1.5">
                    Country
                  </label>
                  <input
                    id="addrCountry"
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
                  className="rounded"
                />
                Set as default {form.type} address
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-ink rounded-full px-4 py-3 text-xs font-display font-semibold uppercase tracking-wide hover:bg-primary-dark transition disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
