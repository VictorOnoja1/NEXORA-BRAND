-- NEXORA — swap "Shop by Category" tile images for real product photos
-- Run this in the Supabase SQL Editor (project vmclvqqovoazylisogin).
--
-- Only 4 of the 8 categories have a real uploaded product photo to draw
-- from right now (wigs-hair, perfumes, jewellery, attachments) — the other
-- 4 (hair-care, skincare-cosmetics, fashion, accessories) don't have any
-- real products in the catalogue yet, so their tile images are left as-is
-- rather than guessing/inventing a photo for them. Add real products to
-- those categories and I can swap their tiles the same way.

begin;

update categories set image = '/images/products/silky-straight-lace-bob-wig.jpg'
  where slug = 'wigs-hair';

update categories set image = '/images/products/betres-fruits-perfume-set.jpg'
  where slug = 'perfumes';

update categories set image = '/images/products/gold-ball-4pc-jewellery-set.jpg'
  where slug = 'jewellery';

update categories set image = '/images/products/pearl-embellished-headband.jpg'
  where slug = 'attachments';

commit;

-- Sanity check — should show the 4 new paths above:
select slug, image from categories order by slug;
