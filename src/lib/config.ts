// Central, editable store configuration.
// In production, move these to environment variables / an admin "Settings"
// table so the owner can change them without a code deploy.

export const siteConfig = {
  brandName: "NEXORA",
  brandFullName: "NEXORA Beauty & Essentials",
  tagline: "Your Style. Your Confidence.",

  // NEXORA WhatsApp business number (international format, no leading +).
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "2348039784232",

  // NEXORA support email.
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "nexorabeautyessentials@gmail.com",

  // Flat delivery fee shown at checkout. Wire this to real logistics
  // pricing (by state/city) once that data exists.
  flatDeliveryFee: 3000,
  freeDeliveryThreshold: 100000,

  socials: {
    instagram: "https://instagram.com/nexorabeauty",
    tiktok: "https://tiktok.com/@nexorabeauty",
  },

  announcement: "FREE DELIVERY ON ORDERS ABOVE ₦100,000",

  // Admin dashboard sign-in. IMPORTANT: this is a client-side-only gate —
  // enough to keep casual visitors out of /admin day-to-day, but the
  // password ships inside the JS bundle, so anyone who inspects it can
  // read it. It is NOT real security. Replace with server-side auth
  // (Supabase Auth — see src/lib/supabase.ts) before this dashboard holds
  // anything you actually need protected. Change these via
  // VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD in .env — don't ship the
  // defaults below to a real store.
  adminUsername: import.meta.env.VITE_ADMIN_USERNAME || "admin",
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || "nexora2026",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
