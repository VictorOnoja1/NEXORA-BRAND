import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, MessageCircle, Sparkles, Shirt } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/product/ProductCard";
import { CategoryCard } from "../components/product/CategoryCard";
import { useCategories } from "../store/categoryStore";
import { useNewArrivals, useBestSellers, useFeaturedProducts } from "../store/productStore";
import { useSubscriberStore } from "../store/subscriberStore";
import { useUIStore } from "../store/uiStore";

// Real NEXORA product photography (not stock placeholders) — a small rotating
// set per category, all sourced from actual uploaded product photos already
// used in the live catalogue. Each tile slowly cycles through its set so the
// hero reads as an editorial rotation rather than a single static banner.
const heroFeatureTiles = [
  {
    label: "Wigs & Hair",
    images: [
      "/images/products/silky-straight-lace-bob-wig.jpg",
      "/images/products/curly-afro-wig.jpg",
      "/images/products/glam-curly-pixie-wig.jpg",
    ],
  },
  {
    label: "Perfumes",
    images: [
      "/images/products/betres-fruits-perfume-set.jpg",
      "/images/products/lattafa-badee-al-oud-collection.jpg",
      "/images/products/kaly-eau-de-parfum-collection.jpg",
    ],
  },
  {
    label: "Jewellery",
    images: [
      "/images/products/gold-ball-4pc-jewellery-set.jpg",
      "/images/products/silver-bangle-bracelet-stack.jpg",
      "/images/products/amber-onyx-gold-stud-earrings.jpg",
    ],
  },
  {
    label: "Hair Accessories",
    images: [
      "/images/products/pearl-embellished-headband.jpg",
      "/images/products/satin-scrunchie-7pack.jpg",
      "/images/products/barbie-star-hair-clip-set.jpg",
    ],
  },
];

const HERO_ROTATE_MS = 4500;

/**
 * One hero grid tile. Crossfades between a small set of real product photos
 * on a slow interval, with a gentle continuous Ken-Burns zoom that resets on
 * every new image, plus a snappier hover zoom layered on top of it. Pauses
 * the rotation on hover, and — since this is background motion the visitor
 * never asked for — is disabled entirely under prefers-reduced-motion.
 */
function HeroImageTile({
  images,
  label,
  index,
}: {
  images: string[];
  label: string;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || images.length <= 1 || paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion, images.length, paused]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setPaused(true)}
      onHoverEnd={() => setPaused(false)}
      className="group relative overflow-hidden"
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={images[active]}
          src={images[active]}
          alt={label}
          loading={index === 0 ? "eager" : "lazy"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : [1, 1.06] }}
          exit={{ opacity: 0, transition: { duration: 0.9 } }}
          whileHover={
            prefersReducedMotion
              ? undefined
              : { scale: 1.12, transition: { duration: 0.5, ease: "easeOut" } }
          }
          transition={{
            opacity: { duration: 0.9 },
            scale: prefersReducedMotion
              ? { duration: 0.3 }
              : { duration: HERO_ROTATE_MS / 1000, ease: "linear" },
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-3 md:p-4 font-serif text-sm md:text-lg text-ivory [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-1">
        {label}
      </span>
    </motion.div>
  );
}

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
          <p className="text-xs font-semibold tracking-widest2 uppercase text-black mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl md:text-4xl text-chocolate">{title}</h2>
        {description && <p className="text-black text-sm mt-2 max-w-lg font-sans">{description}</p>}
      </motion.div>
      {cta && ctaTo && (
        <Link
          to={ctaTo}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-black shrink-0 hover:gap-2.5 transition-all"
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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    const res = await subscribe(newsletterEmail);
    showToast(res.message, res.success ? "success" : "error");
    if (res.success) {
      setNewsletterEmail("");
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-champagne-light overflow-hidden">
        <div className="max-w-8xl mx-auto grid md:grid-cols-2 items-center">
          <div className="px-6 md:px-14 py-16 md:py-28 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-widest2 uppercase text-black mb-5"
            >
              NEXORA Beauty &amp; Essentials
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl text-chocolate leading-[1.08] mb-6"
            >
              Find Something
              <br />
              You'll Love.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-chocolate-muted font-sans text-base max-w-md mb-9 leading-relaxed"
            >
              Beauty, fashion and everyday essentials — picked for you, with
              nationwide delivery across Nigeria.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg">
                  Explore Categories
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-chocolate-muted">
                <ShieldCheck size={15} className="text-black shrink-0" />
                Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-chocolate-muted">
                <Truck size={15} className="text-black shrink-0" />
                Nationwide delivery
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-chocolate-muted">
                <MessageCircle size={15} className="text-black shrink-0" />
                WhatsApp support
              </span>
            </motion.div>
          </div>
          <div className="relative h-72 md:h-full md:min-h-[560px] grid grid-cols-2 grid-rows-2 gap-0.5 bg-ivory">
            {heroFeatureTiles.map((tile, i) => (
              <HeroImageTile key={tile.label} images={tile.images} label={tile.label} index={i} />
            ))}
          </div>
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
          <motion.div {...fadeUp} className="relative rounded-xl overflow-hidden min-h-[280px] md:min-h-[380px] flex items-center bg-gradient-to-br from-plum-600 via-plum-700 to-chocolate">
            <Shirt size={220} strokeWidth={0.75} className="absolute -right-8 -bottom-10 text-ivory/10 pointer-events-none" />
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
      <section className="bg-champagne-light">
        <div className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-4xl text-chocolate mb-3">Why Shop NEXORA</h2>
            <p className="text-chocolate-muted text-sm max-w-lg mx-auto font-sans">
              Built for customers who want quality, style and a shopping experience they can trust.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { icon: ShieldCheck, title: "Secure Payment", desc: "Safe, encrypted checkout on every order." },
              { icon: Sparkles, title: "Quality Products", desc: "Curated beauty, fashion and lifestyle essentials." },
              { icon: Truck, title: "Nationwide Delivery", desc: "We deliver across Nigeria, with clear delivery timelines at checkout." },
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
                <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center mb-4 shadow-soft">
                  <f.icon size={20} className="text-black" />
                </div>
                <h3 className="text-chocolate font-medium text-sm mb-1.5">{f.title}</h3>
                <p className="text-chocolate-muted text-xs max-w-[200px] font-sans">{f.desc}</p>
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
            <p className="text-black text-sm mb-7 font-sans">
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
                className="flex-1 bg-ivory border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
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

