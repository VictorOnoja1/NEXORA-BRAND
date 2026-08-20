import type { Category } from "../types";

import wigsHair from "../assets/placeholders/cat-wigs-hair.jpg";
import hairCare from "../assets/placeholders/cat-hair-care.jpg";
import skincare from "../assets/placeholders/cat-skincare-cosmetics.jpg";
import perfumes from "../assets/placeholders/cat-perfumes.jpg";
import jewellery from "../assets/placeholders/cat-jewellery.jpg";
import attachments from "../assets/placeholders/cat-attachments.jpg";
import fashion from "../assets/placeholders/cat-fashion.jpg";
import accessories from "../assets/placeholders/cat-accessories.jpg";

// NOTE: `image` currently points to bundled on-brand placeholder art
// (src/assets/placeholders) rather than real product photography — NEXORA
// has no live category imagery yet. Swap these for real photos when
// available; see README.md "Connecting real data".
export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "wigs-hair",
    name: "Wigs & Hair",
    descriptor: "Elevate your everyday look.",
    image: wigsHair,
  },
  {
    id: "cat-2",
    slug: "hair-care",
    name: "Hair Care",
    descriptor: "Nourish, strengthen, shine.",
    image: hairCare,
  },
  {
    id: "cat-3",
    slug: "skincare-cosmetics",
    name: "Skincare & Cosmetics",
    descriptor: "Glow that feels like you.",
    image: skincare,
  },
  {
    id: "cat-4",
    slug: "perfumes",
    name: "Perfumes",
    descriptor: "A signature scent, always.",
    image: perfumes,
  },
  {
    id: "cat-5",
    slug: "jewellery",
    name: "Jewellery",
    descriptor: "Finishing touches that shine.",
    image: jewellery,
  },
  {
    id: "cat-6",
    slug: "attachments",
    name: "Attachments",
    descriptor: "Effortless length and volume.",
    image: attachments,
  },
  {
    id: "cat-7",
    slug: "fashion",
    name: "Fashion",
    descriptor: "Style that speaks for you.",
    image: fashion,
  },
  {
    id: "cat-8",
    slug: "accessories",
    name: "Accessories",
    descriptor: "Small details, big confidence.",
    image: accessories,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
