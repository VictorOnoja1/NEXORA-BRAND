export const siteConfig = {
  brandName: "NEXORA",
  brandFullName: "NEXORA Beauty & Essentials",
  tagline: "Your Style. Your Confidence.",

  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "2348039784232",

  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "nexorabeautyessentials@gmail.com",

  flatDeliveryFee: 3000,
  freeDeliveryThreshold: 100000,

  socials: {
    instagram: "https://instagram.com/nexorabeauty",
    tiktok: "https://tiktok.com/@nexorabeauty",
  },

  announcement: "FREE DELIVERY ON ORDERS ABOVE ₦100,000",

  adminUsername: import.meta.env.VITE_ADMIN_USERNAME || "admin",
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || "nexora2026",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
