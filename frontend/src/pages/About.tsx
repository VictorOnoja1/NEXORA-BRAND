import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Heart, Truck } from "lucide-react";

const values = [
  { icon: Sparkles, title: "Elegant", desc: "Polished presentation without feeling distant." },
  { icon: Heart, title: "Feminine", desc: "Expressive, graceful and confidence-first." },
  { icon: ShieldCheck, title: "Trustworthy", desc: "Clear products, pricing and ordering, always." },
  { icon: Truck, title: "Accessible", desc: "Premium presentation that never intimidates." },
];

export default function About() {
  return (
    <div>
      <section className="relative bg-champagne-light overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold tracking-widest2 uppercase text-black mb-4"
          >
            About NEXORA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-5xl text-chocolate leading-tight"
          >
            A modern beauty and lifestyle brand, built on trust.
          </motion.h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-black leading-relaxed font-sans text-base mb-6">
            NEXORA Beauty &amp; Essentials is a modern beauty and lifestyle commerce brand focused on
            helping customers discover quality, stylish and accessible essentials in one convenient
            place. From wigs and hair to skincare, fragrance, jewellery and fashion — we bring together
            the products that help you look and feel like the most confident version of yourself.
          </p>
          <p className="text-black leading-relaxed font-sans text-base">
            We believe premium doesn't have to mean intimidating. Every product on NEXORA is chosen
            with intention, every order is handled with care, and real human support is always a
            message away. This is shopping built around <em className="font-display italic">your style</em> and{" "}
            <em className="font-display italic">your confidence</em>.
          </p>
        </motion.div>
      </section>

      <section className="relative">
        <div className="max-w-8xl mx-auto px-5 md:px-10">
          <div className="relative rounded-xl overflow-hidden aspect-[16/7] bg-gradient-to-br from-champagne via-blush to-plum-300 flex items-center justify-center">
            <Heart size={140} strokeWidth={0.75} className="text-plum-600/25" />
          </div>
        </div>
      </section>

      <section className="max-w-8xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl md:text-3xl text-chocolate text-center mb-12"
        >
          What We Stand For
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blush/60 flex items-center justify-center mx-auto mb-4">
                <v.icon size={20} className="text-black" />
              </div>
              <h3 className="font-serif text-lg text-chocolate mb-1.5">{v.title}</h3>
              <p className="text-xs text-black font-sans">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

