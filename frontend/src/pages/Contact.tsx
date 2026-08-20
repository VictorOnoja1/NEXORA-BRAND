import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "../components/ui/SocialIcons";
import { siteConfig, whatsappLink } from "../lib/config";
import { Button } from "../components/ui/Button";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Delivery timelines depend on your location. We'll confirm an estimated delivery window with you after your order is placed.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept secure online payment via Paystack, including cards, bank transfer and USSD.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Message us on WhatsApp as soon as possible after ordering and we'll do our best to help before it ships.",
  },
  {
    q: "Do you offer support after delivery?",
    a: "Yes — reach out on WhatsApp or email and our team will assist with any questions about your order.",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-10 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs font-semibold tracking-widest2 uppercase text-plum-400 mb-2">Get in Touch</p>
        <h1 className="font-serif text-3xl md:text-5xl text-chocolate mb-3">Contact NEXORA</h1>
        <p className="text-plum-400 text-sm font-sans">
          Questions about an order, a product, or just want to say hi? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {submitted ? (
            <div className="border border-plum-100 rounded-lg p-8 text-center">
              <CheckCircle2 size={32} className="text-plum mx-auto mb-4" />
              <h3 className="font-serif text-xl text-chocolate mb-2">Message sent</h3>
              <p className="text-sm text-plum-400 font-sans">
                Thank you for reaching out — we'll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-plum-500 mb-1.5 block" htmlFor="name">Name</label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-plum-500 mb-1.5 block" htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-plum-500 mb-1.5 block" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
                  placeholder="How can we help?"
                />
              </div>
              <Button type="submit" size="lg" className="self-start">Send Message</Button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <a
            href={whatsappLink("Hi NEXORA, I have a question.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 border border-plum-100 rounded-lg p-5 hover:border-plum transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-[#1a9e4e]" />
            </div>
            <div>
              <p className="text-sm font-medium text-chocolate">WhatsApp Support</p>
              <p className="text-xs text-plum-400 font-sans">Fastest way to reach our team</p>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="flex items-center gap-4 border border-plum-100 rounded-lg p-5 hover:border-plum transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-blush/50 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-plum" />
            </div>
            <div>
              <p className="text-sm font-medium text-chocolate">Email</p>
              <p className="text-xs text-plum-400 font-sans">{siteConfig.supportEmail}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 border border-plum-100 rounded-lg p-5">
            <div className="w-11 h-11 rounded-full bg-champagne/40 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-plum" />
            </div>
            <div>
              <p className="text-sm font-medium text-chocolate">Nationwide Delivery</p>
              <p className="text-xs text-plum-400 font-sans">Shipping across Nigeria</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-plum-200 flex items-center justify-center text-plum hover:bg-plum hover:text-ivory transition-colors">
              <InstagramIcon size={15} />
            </a>
            <a href={siteConfig.socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full border border-plum-200 flex items-center justify-center text-plum hover:bg-plum hover:text-ivory transition-colors">
              <TikTokIcon size={15} />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl text-chocolate text-center mb-8">Frequently Asked Questions</h2>
        <div className="flex flex-col divide-y divide-plum-100 border-t border-b border-plum-100">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-chocolate list-none">
                {f.q}
                <span className="text-plum-300 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="text-sm text-plum-400 mt-2 font-sans leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
