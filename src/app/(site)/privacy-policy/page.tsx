import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api";
import PolicyPage from "@/components/pages/PolicyPage";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy-policy");

  return {
    title: page?.meta_title ?? "Privacy Policy — Rinmora",
    description: page?.meta_description ?? undefined,
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPage("privacy-policy");

  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} eyebrow="Legal" title="Privacy Policy" />;
}
