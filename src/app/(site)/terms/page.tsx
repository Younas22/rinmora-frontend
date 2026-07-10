import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api";
import PolicyPage from "@/components/pages/PolicyPage";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("terms");

  return {
    title: page?.meta_title ?? "Terms & Conditions — Rinmora",
    description: page?.meta_description ?? undefined,
  };
}

export default async function TermsPage() {
  const page = await getPage("terms");

  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} eyebrow="Legal" title="Terms & Conditions" />;
}
