import type { Category } from "../types";

// No dedicated category photography exists yet — CategoryCard renders an
// on-brand gradient + icon tile when `image` is empty, so these intentionally
// ship with no image rather than pointing at a generic stock photo. Set a
// real "/images/categories/<slug>.jpg" here (and upload the file) once real
// photos exist for a category.
export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "wigs-hair",
    name: "Wigs & Hair",
    descriptor: "Elevate your everyday look.",
    image: "",
  },
  {
    id: "cat-2",
    slug: "hair-care",
    name: "Hair Care",
    descriptor: "Nourish, strengthen, shine.",
    image: "",
  },
  {
    id: "cat-3",
    slug: "skincare-cosmetics",
    name: "Skincare & Cosmetics",
    descriptor: "Glow that feels like you.",
    image: "",
  },
  {
    id: "cat-4",
    slug: "perfumes",
    name: "Perfumes",
    descriptor: "A signature scent, always.",
    image: "",
  },
  {
    id: "cat-5",
    slug: "jewellery",
    name: "Jewellery",
    descriptor: "Finishing touches that shine.",
    image: "",
  },
  {
    id: "cat-6",
    slug: "attachments",
    name: "Attachments",
    descriptor: "Effortless length and volume.",
    image: "",
  },
  {
    id: "cat-7",
    slug: "fashion",
    name: "Fashion",
    descriptor: "Style that speaks for you.",
    image: "",
  },
  {
    id: "cat-8",
    slug: "accessories",
    name: "Accessories",
    descriptor: "Small details, big confidence.",
    image: "",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
