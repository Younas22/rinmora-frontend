const STATUS_STYLES: Record<string, string> = {
  pending: "border border-black/15 text-black/60",
  processing: "border border-black/15 text-black/60",
  packed: "bg-primary/25 text-ink",
  shipped: "bg-primary/25 text-ink",
  delivered: "bg-ink text-white",
  cancelled: "bg-black/5 text-black/45",
  returned: "bg-black/5 text-black/45",
  refunded: "bg-black/5 text-black/45",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const className = STATUS_STYLES[status] ?? "bg-black/5 text-black/45";

  return (
    <span
      className={`text-[11px] font-display font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
