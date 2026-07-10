export interface TocEntry {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * CKEditor content only has bare <h2>text</h2> tags with no ids. This extracts
 * a table of contents and rewrites the h2 tags to carry matching ids, so the
 * sticky sidebar's anchor links have something to scroll to.
 */
export function extractTocAndTagHeadings(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];

  const taggedHtml = html.replace(/<h2>(.*?)<\/h2>/g, (_match, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = slugify(text);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  return { html: taggedHtml, toc };
}
