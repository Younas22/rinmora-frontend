const ITEMS = [
  { icon: "fa-gem", title: "Premium Materials", desc: "Sourced leather and hardware built to last a lifetime." },
  { icon: "fa-shapes", title: "Modern Designs", desc: "Timeless silhouettes shaped by contemporary style." },
  { icon: "fa-tags", title: "Affordable Luxury", desc: "Designer quality, priced for the everyday woman." },
  { icon: "fa-lock", title: "Secure Checkout", desc: "Your information is always protected and private." },
  { icon: "fa-truck-fast", title: "Fast Delivery", desc: "Nationwide dispatch within 24-48 hours." },
  { icon: "fa-heart-circle-check", title: "Customer Satisfaction", desc: "Loved by thousands of women, every single day." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-black/[0.02] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            The Rinmora Promise
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold mt-2">Why Choose Rinmora</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl shadow-card p-6 md:p-8 flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-primary/25 grid place-items-center">
                <i className={`fa-solid ${item.icon} text-primary-dark text-lg`} />
              </div>
              <h3 className="font-display font-semibold text-sm md:text-base">{item.title}</h3>
              <p className="text-black/50 text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
