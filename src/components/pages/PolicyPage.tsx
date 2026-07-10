import { extractTocAndTagHeadings } from "@/lib/toc";
import type { CmsPage } from "@/types/cms";

export default function PolicyPage({
  page,
  eyebrow,
  title,
}: {
  page: CmsPage;
  eyebrow: string;
  title: string;
}) {
  const { html, toc } = extractTocAndTagHeadings(page.content);
  const lastUpdated = page.updated_at
    ? new Date(page.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <main className="pt-16 md:pt-20">
      <section className="max-w-3xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-6 text-center">
        <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
          {eyebrow}
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-semibold mt-3">{title}</h1>
        {lastUpdated && <p className="text-black/45 text-sm mt-3">Last Updated: {lastUpdated}</p>}
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <nav aria-label="Table of contents" className="sticky top-28 bg-white rounded-3xl shadow-card p-6">
                <p className="font-display text-xs font-semibold uppercase tracking-wide text-black/40 mb-4">
                  On This Page
                </p>
                <ul className="space-y-3 text-sm">
                  {toc.map((entry) => (
                    <li key={entry.id}>
                      <a href={`#${entry.id}`} className="text-black/60 hover:text-ink transition">
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          <article
            className="space-y-6 text-black/65 text-sm leading-relaxed [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-3 [&_h2:first-child]:mt-0 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-medium"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </main>
  );
}
