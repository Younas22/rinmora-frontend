"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { ApiError, updatePassword, updateProfile } from "@/lib/api";

export default function AccountProfilePage() {
  const { user, token, updateUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone ?? "");
    setEmailNotifications(user.email_notifications);
    setSmsNotifications(user.sms_notifications);
    setMarketingEmails(user.marketing_emails);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setProfileError(null);
    setProfileMessage(null);
    setProfileSaving(true);

    try {
      const updated = await updateProfile(token, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        marketing_emails: marketingEmails,
      });
      updateUser(updated);
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword !== newPasswordConfirmation) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      await updatePassword(token, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });
      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <>
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-black/45 mb-4">
          <Link href="/account" className="hover:text-ink transition">
            My Account
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <span className="text-ink font-medium">Profile & Settings</span>
        </nav>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Profile & Settings</h1>
        <p className="text-black/50 text-sm mt-2">Manage your personal information, password, and preferences.</p>
      </div>

      <section className="bg-white rounded-3xl shadow-card p-6 md:p-7">
        <h2 className="font-display text-lg font-semibold mb-6">Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {profileError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{profileError}</p>
          )}
          {profileMessage && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              {profileMessage}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="firstName" className="block text-xs font-display font-medium text-black/50 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-display font-medium text-black/50 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-medium text-black/50 mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm bg-black/[0.02] text-black/40"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-display font-medium text-black/50 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>

          <div className="border-t border-black/5 pt-5 space-y-3">
            <p className="font-display text-sm font-semibold">Notification Preferences</p>
            <label className="flex items-center justify-between">
              <span className="text-sm text-black/60">Email Notifications</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded accent-[#b89e84]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-black/60">SMS Notifications</span>
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                className="w-5 h-5 rounded accent-[#b89e84]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-black/60">Promotional Offers</span>
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
                className="w-5 h-5 rounded accent-[#b89e84]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="font-display text-xs font-semibold uppercase tracking-wide bg-ink text-white rounded-full px-6 py-3 hover:bg-black/80 transition disabled:opacity-60"
          >
            {profileSaving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-3xl shadow-card p-6 md:p-7">
        <h2 className="font-display text-lg font-semibold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
          {passwordError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              {passwordMessage}
            </p>
          )}

          <div>
            <label htmlFor="currentPassword" className="block text-xs font-display font-medium text-black/50 mb-2">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-xs font-display font-medium text-black/50 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label htmlFor="newPasswordConfirmation" className="block text-xs font-display font-medium text-black/50 mb-2">
              Confirm New Password
            </label>
            <input
              id="newPasswordConfirmation"
              type="password"
              required
              minLength={8}
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="font-display text-xs font-semibold uppercase tracking-wide bg-ink text-white rounded-full px-6 py-3 hover:bg-black/80 transition disabled:opacity-60"
          >
            {passwordSaving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </section>
    </>
  );
}
