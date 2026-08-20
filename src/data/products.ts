import type { Product } from "../types";

// NOTE: This is placeholder seed data — bundled on-brand gradient art
// (src/assets/placeholders) stands in for real product photography, and
// pricing is illustrative Naira. NEXORA has no live product database yet;
// replace this file's role with a real Supabase `products` query once the
// backend is connected (see src/lib/supabase.ts and README.md
// "Connecting real data").

const placeholderImages = import.meta.glob<{ default: string }>(
  "../assets/placeholders/prod-*.jpg",
  { eager: true }
);

function img(id: string, alt: string, variant: "" | "-b" = "") {
  const path = `../assets/placeholders/prod-${id}${variant}.jpg`;
  return { id: `${id}${variant}`, url: placeholderImages[path]?.default ?? "", alt };
}

// This is the seed catalogue only. The live, editable catalogue (what the
// storefront and admin dashboard actually read/write) lives in
// src/store/productStore.ts, which is initialized from this array and then
// persisted locally so admin add/edit/delete actions stick.
export const seedProducts: Product[] = [
  {
    id: "p1",
    slug: "silky-bone-straight-wig",
    name: "Silky Bone Straight Lace Wig",
    categorySlug: "wigs-hair",
    price: 45000,
    previousPrice: 58000,
    description:
      "A luxuriously soft bone-straight lace front wig with a natural hairline. Pre-plucked and ready to wear, this piece gives an effortless, salon-fresh finish for everyday elegance or special occasions.",
    shortDescription: "Pre-plucked lace front, natural hairline, 20-inch length.",
    images: [img("p1", "Silky bone straight lace wig"), img("p1", "Wig detail view", "-b")],
    stock: 12,
    featured: true,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    ratingCount: 24,
    sku: "NX-WIG-001",
    createdAt: "2026-08-01",
  },
  {
    id: "p2",
    slug: "curly-bob-wig",
    name: "Deep Curly Bob Wig",
    categorySlug: "wigs-hair",
    price: 38500,
    description:
      "A voluminous curly bob that holds its bounce wash after wash. Lightweight cap construction keeps it breathable for all-day wear.",
    shortDescription: "Voluminous curls, lightweight breathable cap.",
    images: [img("p2", "Curly bob wig"), img("p2", "Curly bob wig detail", "-b")],
    stock: 8,
    featured: true,
    rating: 4.6,
    ratingCount: 15,
    sku: "NX-WIG-002",
    createdAt: "2026-07-20",
  },
  {
    id: "p3",
    slug: "argan-oil-hair-serum",
    name: "Argan Oil Repair Hair Serum",
    categorySlug: "hair-care",
    price: 8500,
    description:
      "A lightweight, fast-absorbing serum enriched with argan oil to tame frizz, add shine and repair split ends without weighing hair down.",
    shortDescription: "Frizz control and shine, 100ml.",
    images: [img("p3", "Argan oil hair serum bottle")],
    stock: 30,
    featured: false,
    isBestSeller: true,
    rating: 4.7,
    ratingCount: 41,
    sku: "NX-HC-001",
    createdAt: "2026-06-10",
  },
  {
    id: "p4",
    slug: "shea-moisture-repair-mask",
    name: "Shea Butter Deep Repair Hair Mask",
    categorySlug: "hair-care",
    price: 9200,
    previousPrice: 11000,
    description:
      "An intensive weekly treatment mask formulated with shea butter to restore moisture, elasticity and softness to dry, damaged hair.",
    shortDescription: "Weekly deep-conditioning treatment, 250g.",
    images: [img("p4", "Shea butter hair mask jar")],
    stock: 4,
    featured: false,
    rating: 4.5,
    ratingCount: 19,
    sku: "NX-HC-002",
    createdAt: "2026-05-28",
  },
  {
    id: "p5",
    slug: "matte-liquid-lipstick-set",
    name: "Matte Liquid Lipstick Set (3-in-1)",
    categorySlug: "skincare-cosmetics",
    price: 12500,
    description:
      "Three long-wearing, transfer-resistant matte lipstick shades curated for everyday elegance. Lightweight formula that never feels drying.",
    shortDescription: "3 long-wear matte shades, travel-friendly case.",
    images: [img("p5", "Matte liquid lipstick set")],
    stock: 18,
    featured: true,
    isNew: true,
    rating: 4.9,
    ratingCount: 33,
    sku: "NX-SC-001",
    createdAt: "2026-08-05",
  },
  {
    id: "p6",
    slug: "vitamin-c-glow-serum",
    name: "Vitamin C Brightening Glow Serum",
    categorySlug: "skincare-cosmetics",
    price: 15800,
    description:
      "A daily brightening serum with stabilised Vitamin C to even skin tone, fade dark spots and reveal a natural, healthy glow.",
    shortDescription: "Brightening daily serum, 30ml dropper bottle.",
    images: [img("p6", "Vitamin C glow serum")],
    stock: 22,
    featured: true,
    isBestSeller: true,
    rating: 4.8,
    ratingCount: 52,
    sku: "NX-SC-002",
    createdAt: "2026-07-15",
  },
  {
    id: "p7",
    slug: "rose-gold-perfume",
    name: "Rose Nectar Eau de Parfum",
    categorySlug: "perfumes",
    price: 22000,
    description:
      "A warm, feminine fragrance blending rose petals, soft musk and a hint of vanilla. Long-lasting and unforgettable from morning to night.",
    shortDescription: "Floral musk fragrance, 50ml, long-lasting.",
    images: [img("p7", "Rose Nectar perfume bottle")],
    stock: 14,
    featured: true,
    rating: 4.7,
    ratingCount: 28,
    sku: "NX-PF-001",
    createdAt: "2026-06-22",
  },
  {
    id: "p8",
    slug: "amber-oud-perfume",
    name: "Amber Oud Intense",
    categorySlug: "perfumes",
    price: 26500,
    previousPrice: 31000,
    description:
      "A rich, intense oud fragrance layered with amber and warm spice. Bold and confident — designed to be remembered.",
    shortDescription: "Rich oud & amber, 50ml, evening wear.",
    images: [img("p8", "Amber Oud perfume detail")],
    stock: 6,
    featured: false,
    rating: 4.6,
    ratingCount: 11,
    sku: "NX-PF-002",
    createdAt: "2026-05-02",
  },
  {
    id: "p9",
    slug: "gold-plated-hoop-earrings",
    name: "Gold-Plated Statement Hoop Earrings",
    categorySlug: "jewellery",
    price: 7800,
    description:
      "Lightweight gold-plated hoops that elevate any outfit from day to night. Hypoallergenic posts for comfortable all-day wear.",
    shortDescription: "Gold-plated, hypoallergenic, lightweight.",
    images: [img("p9", "Gold-plated hoop earrings")],
    stock: 25,
    featured: false,
    isNew: true,
    rating: 4.8,
    ratingCount: 17,
    sku: "NX-JW-001",
    createdAt: "2026-08-10",
  },
  {
    id: "p10",
    slug: "layered-pendant-necklace",
    name: "Layered Pendant Necklace Set",
    categorySlug: "jewellery",
    price: 9600,
    description:
      "A delicately layered necklace set featuring a dainty pendant, designed to be worn alone or stacked for a personalised look.",
    shortDescription: "3-piece layered set, adjustable chain.",
    images: [img("p10", "Layered pendant necklace set")],
    stock: 10,
    featured: true,
    rating: 4.7,
    ratingCount: 9,
    sku: "NX-JW-002",
    createdAt: "2026-07-01",
  },
  {
    id: "p11",
    slug: "kanekalon-braiding-hair",
    name: "Premium Kanekalon Braiding Hair",
    categorySlug: "attachments",
    price: 3200,
    description:
      "Soft, tangle-resistant kanekalon braiding hair that holds style beautifully and feels natural to the touch.",
    shortDescription: "Tangle-resistant, natural feel, per pack.",
    images: [img("p11", "Kanekalon braiding hair pack")],
    stock: 60,
    featured: false,
    rating: 4.4,
    ratingCount: 22,
    sku: "NX-AT-001",
    createdAt: "2026-04-18",
  },
  {
    id: "p12",
    slug: "clip-in-ponytail",
    name: "Drawstring Clip-In Ponytail",
    categorySlug: "attachments",
    price: 11500,
    description:
      "An easy-to-attach drawstring ponytail for instant length and volume — perfect for a quick style upgrade with no heat required.",
    shortDescription: "Drawstring attach, 18-inch length.",
    images: [img("p12", "Drawstring clip-in ponytail")],
    stock: 3,
    featured: false,
    rating: 4.5,
    ratingCount: 6,
    sku: "NX-AT-002",
    createdAt: "2026-03-30",
  },
  {
    id: "p13",
    slug: "satin-wrap-dress",
    name: "Satin Wrap Midi Dress",
    categorySlug: "fashion",
    price: 24500,
    description:
      "A flattering satin wrap dress designed to skim the body elegantly. Versatile enough for the office, dinner or a special occasion.",
    shortDescription: "Satin finish, adjustable wrap tie, midi length.",
    images: [img("p13", "Satin wrap midi dress")],
    stock: 9,
    featured: true,
    isNew: true,
    rating: 4.9,
    ratingCount: 14,
    sku: "NX-FA-001",
    createdAt: "2026-08-12",
  },
  {
    id: "p14",
    slug: "tailored-blazer",
    name: "Tailored Structured Blazer",
    categorySlug: "fashion",
    price: 32000,
    description:
      "A sharply tailored blazer that instantly polishes any outfit. Structured shoulders, a nipped waist and a timeless silhouette.",
    shortDescription: "Structured fit, lined interior, true to size.",
    images: [img("p14", "Tailored structured blazer")],
    stock: 7,
    featured: false,
    rating: 4.6,
    ratingCount: 8,
    sku: "NX-FA-002",
    createdAt: "2026-06-05",
  },
  {
    id: "p15",
    slug: "structured-tote-bag",
    name: "Structured Leather-Look Tote",
    categorySlug: "accessories",
    price: 18500,
    description:
      "A spacious, structured tote crafted from premium vegan leather. Roomy enough for everyday essentials without compromising on style.",
    shortDescription: "Vegan leather, spacious interior, dual handles.",
    images: [img("p15", "Structured leather-look tote bag")],
    stock: 11,
    featured: true,
    isBestSeller: true,
    rating: 4.8,
    ratingCount: 21,
    sku: "NX-AC-001",
    createdAt: "2026-07-08",
  },
  {
    id: "p16",
    slug: "silk-hair-scarf",
    name: "Pure Silk Hair Scarf",
    categorySlug: "accessories",
    price: 6200,
    description:
      "A pure silk scarf that protects hair while adding a chic finishing touch to any look — equally at home on your hair or around your neck.",
    shortDescription: "100% silk, protects hair, multi-way styling.",
    images: [img("p16", "Pure silk hair scarf")],
    stock: 0,
    featured: false,
    rating: 4.3,
    ratingCount: 5,
    sku: "NX-AC-002",
    createdAt: "2026-02-14",
  },
];

// Pure helpers that operate on any product list — used by both the seed
// data and the live productStore so the logic isn't duplicated.
export function findBySlug(list: Product[], slug: string) {
  return list.find((p) => p.slug === slug);
}

export function findRelated(list: Product[], product: Product, limit = 4) {
  return list
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function filterFeatured(list: Product[]) {
  return list.filter((p) => p.featured);
}

export function sortNewest(list: Product[], limit = 8) {
  return [...list]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function filterBestSellers(list: Product[], limit = 8) {
  return list.filter((p) => p.isBestSeller).slice(0, limit);
}
