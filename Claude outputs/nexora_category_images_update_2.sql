-- NEXORA — round 2 category tile image swap
-- Run this in the Supabase SQL Editor (project vmclvqqovoazylisogin).
--
-- Wigs & Hair: swapped to the new curly wig photo you sent (replaces the
-- straight lace bob wig photo used before).
-- Hair Care: now has a real photo for the first time (the rosemary + batana
-- hair growth oil photo you sent) — no longer a generic stock image.
--
-- Skincare & Cosmetics, Fashion, and Accessories are intentionally left
-- unchanged: the photos sent for those showed a third-party skincare brand,
-- a professional runway/event photo, and a listing image with baked-in
-- text ("The Gift Box Is Not Included") — you asked to hold off on all
-- three until there's a cleaner, owned photo to use instead.

begin;

update categories set image = '/images/products/curly-afro-wig.jpg'
  where slug = 'wigs-hair';

update categories set image = '/images/products/rosemary-batana-hair-growth-oil.jpg'
  where slug = 'hair-care';

commit;

-- Sanity check — should show the 2 updated paths above:
select slug, image from categories order by slug;
