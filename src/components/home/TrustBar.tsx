const ITEMS = [
  { icon: "fa-gem", label: "Premium Quality" },
  { icon: "fa-truck-fast", label: "Fast Shipping" },
  { icon: "fa-money-bill-wave", label: "Cash on Delivery" },
  { icon: "fa-rotate-left", label: "Easy Returns" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <i className={`fa-solid ${item.icon} text-primary-dark text-lg`} />
              <p className="font-display text-xs md:text-sm font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
