import Link from "next/link";

export default function Pagination({
  currentPage,
  lastPage,
  buildHref,
}: {
  currentPage: number;
  lastPage: number;
  buildHref: (page: number) => string;
}) {
  if (lastPage <= 1) return null;

  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(lastPage, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 sm:gap-2 mt-14 overflow-x-auto px-2">
      <Link
        aria-label="Previous page"
        href={buildHref(Math.max(1, currentPage - 1))}
        className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-black/10 grid place-items-center hover:bg-black/5 transition text-xs ${
          currentPage === 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <i className="fa-solid fa-chevron-left" />
      </Link>

      {visiblePages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full grid place-items-center text-sm font-display transition ${
            page === currentPage
              ? "bg-ink text-white font-semibold"
              : "border border-black/10 hover:bg-black/5 font-medium"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        aria-label="Next page"
        href={buildHref(Math.min(lastPage, currentPage + 1))}
        className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-black/10 grid place-items-center hover:bg-black/5 transition text-xs ${
          currentPage === lastPage ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <i className="fa-solid fa-chevron-right" />
      </Link>
    </nav>
  );
}
