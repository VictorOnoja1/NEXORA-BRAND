-- =============================================================================
-- NEXORA — add 5 new Wigs & Hair products (2026-09-08)
-- =============================================================================
-- Run in the Supabase SQL Editor (project vmclvqqovoazylisogin).
--
-- WHY ONLY 5, NOT ALL 11 PHOTOS SENT:
--   Cross-checking against the image files already in your site's
--   public/images/products/ folder, 6 of the 11 wig photos sent this
--   session look like they're already live products:
--     - 2 "curly bob with bangs" photos  -> matches existing bob-wig-with-bangs.jpg
--     - the pixie curls photo            -> matches existing curly-pixie-lace-wig.jpg /
--                                            ginger-curly-pixie-wig.jpg / glam-curly-pixie-wig.jpg
--     - the blonde straight bob photo    -> matches existing silky-straight-lace-bob-wig.jpg /
--                                            10inch-2x6-lace-bob-wig.jpg
--     - the sleek straight lace-front closeup -> matches existing hd-lace-slick-bob-wig.jpg
--     - the finger-wave hairline closeup -> a styling technique shot, not a distinct sellable wig
--   Adding those again would very likely duplicate products you already have live.
--   The 5 below (updo, finger-wave curly bob, highlighted bob, braided-front afro,
--   curly twist braids) did NOT match anything already in that folder.
--
-- PRICING: placeholder, set in line with your existing wig prices (₦35,000–₦48,000
--   range). Adjust exact figures any time in Admin > Products > Edit.
--
-- IMAGES: this script assumes the 5 files below have been copied into
--   public/images/products/ (delivered alongside this script) before your next
--   deploy. Until then the product rows will exist but show a broken image.
--
-- SAFE TO RE-RUN: uses "on conflict (slug) do nothing" on products, and skips
--   an image insert if that exact image URL is already attached to the product.
-- =============================================================================

begin;

insert into products
  (slug, name, category_slug, price, previous_price, description, short_description,
   stock, featured, is_new, is_best_seller, rating, rating_count, sku, created_at)
values
  ('curled-chignon-updo-wig', 'Curled Chignon Updo Wig', 'wigs-hair', 42000, null,
    'A polished, pinned-curl updo wig that looks salon-styled straight out of the box — ideal for weddings, owambe, and other dress-up occasions.',
    'Salon-styled pinned curls, event-ready.', 6, true, true, false, null, 0, 'NX-WIG-0908-1', now()),

  ('curly-bob-finger-wave-wig', 'Curly Bob with Finger Waves Wig', 'wigs-hair', 39500, null,
    'A shoulder-length curly bob with a sleek finger-waved side part at the hairline for a soft, retro-glam finish.',
    'Curly bob, finger-waved side part.', 8, true, true, false, null, 0, 'NX-WIG-0908-2', now()),

  ('highlighted-straight-bob-wig', 'Highlighted Straight Bob Wig', 'wigs-hair', 46000, null,
    'A sleek straight lace bob in deep black with a caramel money-piece highlight framing the face for an instant dimension boost.',
    'Straight lace bob, caramel money-piece.', 5, true, true, false, null, 0, 'NX-WIG-0908-3', now()),

  ('afro-braided-front-wig', 'Afro Wig with Braided Front', 'wigs-hair', 35000, null,
    'A full natural afro wig with a cornrowed front section for a fuss-free protective-style look with volume that lasts.',
    'Natural afro, cornrowed front.', 7, true, true, false, null, 0, 'NX-WIG-0908-4', now()),

  ('curly-twist-braids', 'Long Curly Twist Braids', 'wigs-hair', 28000, null,
    'Long, defined twist braids with curly ends — pre-styled for a natural, low-manipulation look that lasts for weeks.',
    'Long twist braids, curly ends.', 10, true, true, false, null, 0, 'NX-WIG-0908-5', now())
on conflict (slug) do nothing;

insert into product_images (product_id, url, alt, position)
select p.id, v.url, v.alt, 0
from (values
  ('curled-chignon-updo-wig',     '/images/products/curled-chignon-updo-wig.jpg',     'Curled chignon updo wig'),
  ('curly-bob-finger-wave-wig',   '/images/products/curly-bob-finger-wave-wig.jpg',   'Curly bob with finger waves wig'),
  ('highlighted-straight-bob-wig','/images/products/highlighted-straight-bob-wig.jpg','Highlighted straight bob wig'),
  ('afro-braided-front-wig',      '/images/products/afro-braided-front-wig.jpg',      'Afro wig with braided front'),
  ('curly-twist-braids',          '/images/products/curly-twist-braids.jpg',          'Long curly twist braids')
) as v(product_slug, url, alt)
join products p on p.slug = v.product_slug
where not exists (
  select 1 from product_images pi where pi.product_id = p.id and pi.url = v.url
);

commit;

-- Sanity check:
select slug, name, price, featured from products where sku like 'NX-WIG-0908-%' order by sku;
