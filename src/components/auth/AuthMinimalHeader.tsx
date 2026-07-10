import Link from "next/link";

export default function AuthMinimalHeader({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-01.png" alt="Rinmora" className="h-10 md:h-12 w-auto" />
          </Link>
          <Link
            href={backHref}
            className="font-display text-xs font-semibold uppercase tracking-wide text-black/50 hover:text-ink transition"
          >
            <i className="fa-solid fa-arrow-left mr-2 text-[10px]" />
            {backLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
