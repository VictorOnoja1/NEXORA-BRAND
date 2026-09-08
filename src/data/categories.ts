import type { Category } from "../types";

// Images live under public/images/categories/ with STABLE filenames (not
// Vite's content-hashed build output) so a URL seeded into the database
// today still resolves after a future rebuild/redeploy.
const wigsHair = "/images/categories/cat-wigs-hair.jpg";
const hairCare = "/images/categories/cat-hair-care.jpg";
const skincare = "/images/categories/cat-skincare-cosmetics.jpg";
const perfumes = "/images/categories/cat-perfumes.jpg";
const jewellery = "/images/categories/cat-jewellery.jpg";
const attachments = "/images/categories/cat-attachments.jpg";
const fashion = "/images/categories/cat-fashion.jpg";
const accessories = "/images/categories/cat-accessories.jpg";
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
