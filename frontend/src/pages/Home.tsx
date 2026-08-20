import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/product/ProductCard";
import { CategoryCard } from "../components/product/CategoryCard";
import { useCategories } from "../store/categoryStore";
import { useNewArrivals, useBestSellers, useFeaturedProducts } from "../store/productStore";
import { useSubscriberStore } from "../store/subscriberStore";
import { useUIStore } from "../store/uiStore";
import editorialImg from "../assets/placeholders/editorial-banner.jpg";
import featureWigStands from "../assets/placeholders/feature-wig-stands.jpg";
import featureDetanglingSprays from "../assets/placeholders/feature-detangling-sprays.jpg";
import featureSilkSleepCaps from "../assets/placeholders/feature-silk-sleep-caps.jpg";
import featureHeatedCurlers from "../assets/placeholders/feature-heated-curlers.jpg";

const heroFeatureTiles = [
  { image: featureWigStands, label: "Premium Wig Stands" },
  { image: featureDetanglingSprays, label: "Detangling Sprays" },
  { image: featureSilkSleepCaps, label: "Silk Sleep Caps" },
  { image: featureHeatedCurlers, label: "Heated Curlers" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  ctaTo,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: string;
  ctaTo?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8 md:mb-10 gap-4">
      <motion.div {...fadeUp}>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest2 uppercase text-plum-400 mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl md:text-4xl text-chocolate">{title}</h2>
        {description && <p className="text-plum-400 text-sm mt-2 max-w-lg font-sans">{description}</p>}
      </motion.div>
      {cta && ctaTo && (
        <Link
          to={ctaTo}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-plum shrink-0 hover:gap-2.5 transition-all"
        >
          {cta} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const categories = useCategories();
  const newArrivals = useNewArrivals(8);
  const bestSellers = useBestSellers(8);
  const featured = useFeaturedProducts().slice(0, 4);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const subscribe = useSubscriberStore((s) => s.subscribe);
  const showToast = useUIStore((s) => s.showToast);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    const res = subscribe(newsletterEmail);
    showToast(res.message, res.success ? "success" : "error");
    if (res.success) {
      setNewsletterEmail("");
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-plum overflow-hidden">
        <div className="max-w-8xl mx-auto grid md:grid-cols-2 items-center">
          <div className="px-6 md:px-14 py-16 md:py-28 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-widest2 uppercase text-champagne mb-5"
            >
              NEXORA Beauty &amp; Essentials
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl text-ivory leading-[1.08] mb-6"
            >
              Your Style.
              <br />
              Your Confidence.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-ivory/75 font-sans text-base max-w-md mb-9 leading-relaxed"
            >
              Discover beauty, fashion and everyday essentials curated for the
              modern woman — all in one convenient, trusted store.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop">
                <Button variant="secondary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="!border-ivory/40 !text-ivory hover:!bg-ivory hover:!text-plum"
                >
                  Explore Categories
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-72 md:h-full md:min-h-[560px] grid grid-cols-2 grid-rows-2 gap-0.5 bg-plum-100/20"
          >
            {heroFeatureTiles.map((tile) => (
              <div key={tile.label} className="relative overflow-hidden">
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 md:p-4 font-serif text-sm md:text-lg text-ivory [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                  {tile.label}
                </span>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-plum/40 md:from-plum/25 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <SectionHeading
          eyebrow="Shop by Category"
          title="Find what you're looking for"
          description="From wigs and hair to skincare, fashion and jewellery — everything you need in one place."
          cta="View all categories"
          ctaTo="/categories"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.slice(0, 8).map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-ivory-dark/60">
        <div className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
          <SectionHeading eyebrow="Just In" title="New Arrivals" cta="Shop new arrivals" ctaTo="/shop?filter=new" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative">
        <div className="max-w-8xl mx-auto px-5 md:px-10 py-4">
          <motion.div {...fadeUp} className="relative rounded-xl overflow-hidden min-h-[280px] md:min-h-[380px] flex items-center">
            <img
              src={editorialImg}
              alt="NEXORA fashion edit"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chocolate/75 via-chocolate/30 to-transparent" />
            <div className="relative z-10 px-8 md:px-16 max-w-md">
              <p className="text-xs font-semibold tracking-widest2 uppercase text-champagne mb-3">
                The Edit
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-ivory mb-4 leading-tight">
                Fashion that moves with your confidence
              </h3>
              <Link to="/shop?category=fashion">
                <Button variant="secondary">Shop the Edit</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <SectionHeading eyebrow="Customer Favourites" title="Best Sellers" cta="Shop best sellers" ctaTo="/shop?filter=bestsellers" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* WHY NEXORA */}
      <section className="bg-plum-800">
        <div className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-4xl text-ivory mb-3">Why Shop NEXORA</h2>
            <p className="text-ivory/60 text-sm max-w-lg mx-auto font-sans">
              Built for customers who want quality, style and a shopping experience they can trust.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { icon: ShieldCheck, title: "Secure Payment", desc: "Safe, encrypted checkout on every order." },
              { icon: Sparkles, title: "Quality Products", desc: "Curated beauty, fashion and lifestyle essentials." },
              { icon: Truck, title: "Easy Ordering", desc: "A smooth journey from browsing to delivery." },
              { icon: MessageCircle, title: "WhatsApp Support", desc: "Real human help, whenever you need it." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-champagne/15 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-champagne" />
                </div>
                <h3 className="text-ivory font-medium text-sm mb-1.5">{f.title}</h3>
                <p className="text-ivory/50 text-xs max-w-[200px] font-sans">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured Products"
          description="A curated edit of what we love right now."
          cta="Shop all"
          ctaTo="/shop"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-blush/50">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-2xl md:text-3xl text-chocolate mb-3">
              Stay in the know
            </h2>
            <p className="text-plum-500 text-sm mb-7 font-sans">
              Be the first to hear about new arrivals, restocks and NEXORA edits.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-ivory border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
              />
              <Button type="submit" variant="primary">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

