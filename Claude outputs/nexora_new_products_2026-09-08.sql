-- =============================================================================
-- NEXORA — add 8 new products (2026-09-08)
-- =============================================================================
-- Run this in the Supabase SQL Editor for project vmclvqqovoazylisogin.
--
-- WHAT THIS FIXES: I checked your live database directly and confirmed that
-- an earlier version of this script (for the 5 wigs) never actually landed —
-- the products table still only has the original 32 rows, all dated Sept 6.
-- Nothing from any of the later photo batches (wigs round 2, perfumes,
-- skincare, jewellery, luggage) has been added yet. This script covers the
-- items that are fully ready right now (SQL + image files both in place):
--   - 5 new wigs
--   - 1 more wig (natural curly afro) found already staged but never scripted
--   - 1 hair-care item (rosemary & batana hair growth oil) — same situation
--   - 1 jewellery item (silver bangle stack) — same situation
--
-- SKUs below use your real prefixes (NX-WG-, NX-HC-, NX-JW-) matching what's
-- already live — my first draft of the wigs script mistakenly used "NX-WIG-"
-- which doesn't match your existing NX-WG- series. Fixed here.
--
-- IMAGES: all 8 image files are already sitting in public/images/products/
-- on your machine (I checked). Nothing else to copy before you deploy.
--
-- SAFE TO RE-RUN: "on conflict (slug) do nothing" on products, and the image
-- insert skips any row that's already attached.
-- =============================================================================

begin;

insert into products
  (slug, name, category_slug, price, previous_price, description, short_description,
   stock, featured, is_new, is_best_seller, rating, rating_count, sku, created_at)
values
  ('curled-chignon-updo-wig', 'Curled Chignon Updo Wig', 'wigs-hair', 42000, null,
    'A polished, pinned-curl updo wig that looks salon-styled straight out of the box — ideal for weddings, owambe, and other dress-up occasions.',
    'Salon-styled pinned curls, event-ready.', 6, true, true, false, null, 0, 'NX-WG-009', now()),

  ('curly-bob-finger-wave-wig', 'Curly Bob with Finger Waves Wig', 'wigs-hair', 39500, null,
    'A shoulder-length curly bob with a sleek finger-waved side part at the hairline for a soft, retro-glam finish.',
    'Curly bob, finger-waved side part.', 8, true, true, false, null, 0, 'NX-WG-010', now()),

  ('highlighted-straight-bob-wig', 'Highlighted Straight Bob Wig', 'wigs-hair', 46000, null,
    'A sleek straight lace bob in deep black with a caramel money-piece highlight framing the face for an instant dimension boost.',
    'Straight lace bob, caramel money-piece.', 5, true, true, false, null, 0, 'NX-WG-011', now()),

  ('afro-braided-front-wig', 'Afro Wig with Braided Front', 'wigs-hair', 35000, null,
    'A full natural afro wig with a cornrowed front section for a fuss-free protective-style look with volume that lasts.',
    'Natural afro, cornrowed front.', 7, true, true, false, null, 0, 'NX-WG-012', now()),

  ('curly-twist-braids', 'Long Curly Twist Braids', 'wigs-hair', 28000, null,
    'Long, defined twist braids with curly ends — pre-styled for a natural, low-manipulation look that lasts for weeks.',
    'Long twist braids, curly ends.', 10, true, true, false, null, 0, 'NX-WG-013', now()),

  ('curly-afro-wig', 'Natural Curly Afro Wig', 'wigs-hair', 34000, null,
    'A full, bouncy natural-afro-textured wig with soft, defined curls all over — an easy everyday volume look with no styling needed.',
    'Full natural afro, defined curls, no styling needed.', 9, true, true, false, null, 0, 'NX-WG-014', now()),

  ('rosemary-batana-hair-growth-oil', 'Rosemary & Batana-Blend Hair Growth Oil (30ml)', 'hair-care', 7500, null,
    'A rosemary and batana-blend hair oil that strengthens strands and nourishes the scalp — a lightweight, unrefined natural plant extract in a convenient 30ml dropper bottle.',
    'Strengthens hair, nourishes scalp. 30ml dropper.', 15, true, true, false, null, 0, 'NX-HC-001', now()),

  ('silver-bangle-bracelet-stack', 'Silver Bangle & Bracelet 4-Piece Stack', 'jewellery', 12000, null,
    'A mixed-texture 4-piece silver bangle and bracelet stack — a smooth cuff, a ridged bar cuff, a wavy open cuff and a hammered-disc chain bracelet, worn together or separately.',
    '4-piece silver bangle & bracelet stack.', 12, true, true, false, null, 0, 'NX-JW-007', now())
on conflict (slug) do nothing;

insert into product_images (product_id, url, alt, position)
select p.id, v.url, v.alt, 0
from (values
  ('curled-chignon-updo-wig',        '/images/products/curled-chignon-updo-wig.jpg',        'Curled chignon updo wig'),
  ('curly-bob-finger-wave-wig',      '/images/products/curly-bob-finger-wave-wig.jpg',      'Curly bob with finger waves wig'),
  ('highlighted-straight-bob-wig',   '/images/products/highlighted-straight-bob-wig.jpg',   'Highlighted straight bob wig'),
  ('afro-braided-front-wig',         '/images/products/afro-braided-front-wig.jpg',         'Afro wig with braided front'),
  ('curly-twist-braids',             '/images/products/curly-twist-braids.jpg',             'Long curly twist braids'),
  ('curly-afro-wig',                 '/images/products/curly-afro-wig.jpg',                 'Natural curly afro wig'),
  ('rosemary-batana-hair-growth-oil','/images/products/rosemary-batana-hair-growth-oil.jpg','Rosemary and batana-blend hair growth oil box and bottle'),
  ('silver-bangle-bracelet-stack',   '/images/products/silver-bangle-bracelet-stack.jpg',   'Silver bangle and bracelet 4-piece stack')
) as v(product_slug, url, alt)
join products p on p.slug = v.product_slug
where not exists (
  select 1 from product_images pi where pi.product_id = p.id and pi.url = v.url
);

commit;

-- Sanity check — run this AFTER the block above and you should see 8 rows:
select slug, name, sku, price, featured from products
where sku in ('NX-WG-009','NX-WG-010','NX-WG-011','NX-WG-012','NX-WG-013','NX-WG-014','NX-HC-001','NX-JW-007')
order by sku;
