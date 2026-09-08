-- NEXORA — round 3 category tile image swap
-- Run this in the Supabase SQL Editor (project vmclvqqovoazylisogin).
--
-- Accessories: now has a real photo for the first time (the silver bangle
-- bracelet stack you sent) — no longer a generic stock image.
--
-- The other 5 photos from this batch are NOT wired up here — see the chat
-- for why (two show multiple readable competitor skincare brand names, one
-- has a visible tiled watermark across it, and two look like professional
-- fashion campaign/runway photography rather than owned photos).

begin;

update categories set image = '/images/products/silver-bangle-bracelet-stack.jpg'
  where slug = 'accessories';

commit;

-- Sanity check:
select slug, image from categories order by slug;
