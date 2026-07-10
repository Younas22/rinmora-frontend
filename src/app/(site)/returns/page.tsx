import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api";
import PolicyPage from "@/components/pages/PolicyPage";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("returns");

  return {
    title: page?.meta_title ?? "Returns & Refunds — Rinmora",
    description: page?.meta_description ?? undefined,
  };
}

export default async function ReturnsPage() {
  const page = await getPage("returns");

  if (!page) {
    notFound();
  }

  return <PolicyPage page={page} eyebrow="Customer Care" title="Returns & Refunds" />;
}
