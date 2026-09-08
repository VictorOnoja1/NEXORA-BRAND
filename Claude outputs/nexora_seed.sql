-- =============================================================================
-- NEXORA Beauty & Essentials — seed data
-- Run this AFTER supabase/schema.sql (Settings → SQL Editor → New Query).
-- Populates the 8 categories and 16-product starter catalogue that the
-- storefront ships with today, using the stable /images/... URLs served by
-- the deployed site (public/images/products, public/images/categories).
-- Safe to re-run: it skips rows that already exist by slug.
-- =============================================================================

insert into categories (slug, name, descriptor, image, sort_order) values
  ('wigs-hair', 'Wigs & Hair', 'Elevate your everyday look.', '/images/categories/cat-wigs-hair.jpg', 1),
  ('hair-care', 'Hair Care', 'Nourish, strengthen, shine.', '/images/categories/cat-hair-care.jpg', 2),
  ('skincare-cosmetics', 'Skincare & Cosmetics', 'Glow that feels like you.', '/images/categories/cat-skincare-cosmetics.jpg', 3),
  ('perfumes', 'Perfumes', 'A signature scent, always.', '/images/categories/cat-perfumes.jpg', 4),
  ('jewellery', 'Jewellery', 'Finishing touches that shine.', '/images/categories/cat-jewellery.jpg', 5),
  ('attachments', 'Attachments', 'Effortless length and volume.', '/images/categories/cat-attachments.jpg', 6),
  ('fashion', 'Fashion', 'Style that speaks for you.', '/images/categories/cat-fashion.jpg', 7),
  ('accessories', 'Accessories', 'Small details, big confidence.', '/images/categories/cat-accessories.jpg', 8)
on conflict (slug) do nothing;

insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, rating, rating_count, sku, created_at) values
  ('silky-bone-straight-wig', 'Silky Bone Straight Lace Wig', 'wigs-hair', 45000, 58000, 'A luxuriously soft bone-straight lace front wig with a natural hairline. Pre-plucked and ready to wear, this piece gives an effortless, salon-fresh finish for everyday elegance or special occasions.', 'Pre-plucked lace front, natural hairline, 20-inch length.', 12, true, true, true, 4.8, 24, 'NX-WIG-001', '2026-08-01'),
  ('curly-bob-wig', 'Deep Curly Bob Wig', 'wigs-hair', 38500, null, 'A voluminous curly bob that holds its bounce wash after wash. Lightweight cap construction keeps it breathable for all-day wear.', 'Voluminous curls, lightweight breathable cap.', 8, true, false, false, 4.6, 15, 'NX-WIG-002', '2026-07-20'),
  ('argan-oil-hair-serum', 'Argan Oil Repair Hair Serum', 'hair-care', 8500, null, 'A lightweight, fast-absorbing serum enriched with argan oil to tame frizz, add shine and repair split ends without weighing hair down.', 'Frizz control and shine, 100ml.', 30, false, false, true, 4.7, 41, 'NX-HC-001', '2026-06-10'),
  ('shea-moisture-repair-mask', 'Shea Butter Deep Repair Hair Mask', 'hair-care', 9200, 11000, 'An intensive weekly treatment mask formulated with shea butter to restore moisture, elasticity and softness to dry, damaged hair.', 'Weekly deep-conditioning treatment, 250g.', 4, false, false, false, 4.5, 19, 'NX-HC-002', '2026-05-28'),
  ('matte-liquid-lipstick-set', 'Matte Liquid Lipstick Set (3-in-1)', 'skincare-cosmetics', 12500, null, 'Three long-wearing, transfer-resistant matte lipstick shades curated for everyday elegance. Lightweight formula that never feels drying.', '3 long-wear matte shades, travel-friendly case.', 18, true, true, false, 4.9, 33, 'NX-SC-001', '2026-08-05'),
  ('vitamin-c-glow-serum', 'Vitamin C Brightening Glow Serum', 'skincare-cosmetics', 15800, null, 'A daily brightening serum with stabilised Vitamin C to even skin tone, fade dark spots and reveal a natural, healthy glow.', 'Brightening daily serum, 30ml dropper bottle.', 22, true, false, true, 4.8, 52, 'NX-SC-002', '2026-07-15'),
  ('rose-gold-perfume', 'Rose Nectar Eau de Parfum', 'perfumes', 22000, null, 'A warm, feminine fragrance blending rose petals, soft musk and a hint of vanilla. Long-lasting and unforgettable from morning to night.', 'Floral musk fragrance, 50ml, long-lasting.', 14, true, false, false, 4.7, 28, 'NX-PF-001', '2026-06-22'),
  ('amber-oud-perfume', 'Amber Oud Intense', 'perfumes', 26500, 31000, 'A rich, intense oud fragrance layered with amber and warm spice. Bold and confident — designed to be remembered.', 'Rich oud & amber, 50ml, evening wear.', 6, false, false, false, 4.6, 11, 'NX-PF-002', '2026-05-02'),
  ('gold-plated-hoop-earrings', 'Gold-Plated Statement Hoop Earrings', 'jewellery', 7800, null, 'Lightweight gold-plated hoops that elevate any outfit from day to night. Hypoallergenic posts for comfortable all-day wear.', 'Gold-plated, hypoallergenic, lightweight.', 25, false, true, false, 4.8, 17, 'NX-JW-001', '2026-08-10'),
  ('layered-pendant-necklace', 'Layered Pendant Necklace Set', 'jewellery', 9600, null, 'A delicately layered necklace set featuring a dainty pendant, designed to be worn alone or stacked for a personalised look.', '3-piece layered set, adjustable chain.', 10, true, false, false, 4.7, 9, 'NX-JW-002', '2026-07-01'),
  ('kanekalon-braiding-hair', 'Premium Kanekalon Braiding Hair', 'attachments', 3200, null, 'Soft, tangle-resistant kanekalon braiding hair that holds style beautifully and feels natural to the touch.', 'Tangle-resistant, natural feel, per pack.', 60, false, false, false, 4.4, 22, 'NX-AT-001', '2026-04-18'),
  ('clip-in-ponytail', 'Drawstring Clip-In Ponytail', 'attachments', 11500, null, 'An easy-to-attach drawstring ponytail for instant length and volume — perfect for a quick style upgrade with no heat required.', 'Drawstring attach, 18-inch length.', 3, false, false, false, 4.5, 6, 'NX-AT-002', '2026-03-30'),
  ('satin-wrap-dress', 'Satin Wrap Midi Dress', 'fashion', 24500, null, 'A flattering satin wrap dress designed to skim the body elegantly. Versatile enough for the office, dinner or a special occasion.', 'Satin finish, adjustable wrap tie, midi length.', 9, true, true, false, 4.9, 14, 'NX-FA-001', '2026-08-12'),
  ('tailored-blazer', 'Tailored Structured Blazer', 'fashion', 32000, null, 'A sharply tailored blazer that instantly polishes any outfit. Structured shoulders, a nipped waist and a timeless silhouette.', 'Structured fit, lined interior, true to size.', 7, false, false, false, 4.6, 8, 'NX-FA-002', '2026-06-05'),
  ('structured-tote-bag', 'Structured Leather-Look Tote', 'accessories', 18500, null, 'A spacious, structured tote crafted from premium vegan leather. Roomy enough for everyday essentials without compromising on style.', 'Vegan leather, spacious interior, dual handles.', 11, true, false, true, 4.8, 21, 'NX-AC-001', '2026-07-08'),
  ('silk-hair-scarf', 'Pure Silk Hair Scarf', 'accessories', 6200, null, 'A pure silk scarf that protects hair while adding a chic finishing touch to any look — equally at home on your hair or around your neck.', '100% silk, protects hair, multi-way styling.', 0, false, false, false, 4.3, 5, 'NX-AC-002', '2026-02-14')
on conflict (slug) do nothing;

-- Product images: main shot (position 0) for all 16, plus a detail shot
-- (position 1) for every product that has a "-b" variant file.
insert into product_images (product_id, url, alt, position)
select p.id, v.url, v.alt, v.position
from products p
join (values
  ('silky-bone-straight-wig', '/images/products/prod-p1.jpg', 'Silky bone straight lace wig', 0),
  ('silky-bone-straight-wig', '/images/products/prod-p1-b.jpg', 'Wig detail view', 1),
  ('curly-bob-wig', '/images/products/prod-p2.jpg', 'Curly bob wig', 0),
  ('curly-bob-wig', '/images/products/prod-p2-b.jpg', 'Curly bob wig detail', 1),
  ('argan-oil-hair-serum', '/images/products/prod-p3.jpg', 'Argan oil hair serum bottle', 0),
  ('argan-oil-hair-serum', '/images/products/prod-p3-b.jpg', 'Argan oil hair serum detail', 1),
  ('shea-moisture-repair-mask', '/images/products/prod-p4.jpg', 'Shea butter hair mask jar', 0),
  ('shea-moisture-repair-mask', '/images/products/prod-p4-b.jpg', 'Shea butter hair mask detail', 1),
  ('matte-liquid-lipstick-set', '/images/products/prod-p5.jpg', 'Matte liquid lipstick set', 0),
  ('matte-liquid-lipstick-set', '/images/products/prod-p5-b.jpg', 'Matte liquid lipstick set detail', 1),
  ('vitamin-c-glow-serum', '/images/products/prod-p6.jpg', 'Vitamin C glow serum', 0),
  ('vitamin-c-glow-serum', '/images/products/prod-p6-b.jpg', 'Vitamin C glow serum detail', 1),
  ('rose-gold-perfume', '/images/products/prod-p7.jpg', 'Rose Nectar perfume bottle', 0),
  ('rose-gold-perfume', '/images/products/prod-p7-b.jpg', 'Rose Nectar perfume detail', 1),
  ('amber-oud-perfume', '/images/products/prod-p8.jpg', 'Amber Oud perfume detail', 0),
  ('amber-oud-perfume', '/images/products/prod-p8-b.jpg', 'Amber Oud perfume bottle', 1),
  ('gold-plated-hoop-earrings', '/images/products/prod-p9.jpg', 'Gold-plated hoop earrings', 0),
  ('gold-plated-hoop-earrings', '/images/products/prod-p9-b.jpg', 'Gold-plated hoop earrings detail', 1),
  ('layered-pendant-necklace', '/images/products/prod-p10.jpg', 'Layered pendant necklace set', 0),
  ('layered-pendant-necklace', '/images/products/prod-p10-b.jpg', 'Layered pendant necklace detail', 1),
  ('kanekalon-braiding-hair', '/images/products/prod-p11.jpg', 'Kanekalon braiding hair pack', 0),
  ('kanekalon-braiding-hair', '/images/products/prod-p11-b.jpg', 'Kanekalon braiding hair detail', 1),
  ('clip-in-ponytail', '/images/products/prod-p12.jpg', 'Drawstring clip-in ponytail', 0),
  ('clip-in-ponytail', '/images/products/prod-p12-b.jpg', 'Drawstring clip-in ponytail detail', 1),
  ('satin-wrap-dress', '/images/products/prod-p13.jpg', 'Satin wrap midi dress', 0),
  ('satin-wrap-dress', '/images/products/prod-p13-b.jpg', 'Satin wrap midi dress detail', 1),
  ('tailored-blazer', '/images/products/prod-p14.jpg', 'Tailored structured blazer', 0),
  ('tailored-blazer', '/images/products/prod-p14-b.jpg', 'Tailored structured blazer detail', 1),
  ('structured-tote-bag', '/images/products/prod-p15.jpg', 'Structured leather-look tote bag', 0),
  ('structured-tote-bag', '/images/products/prod-p15-b.jpg', 'Structured leather-look tote detail', 1),
  ('silk-hair-scarf', '/images/products/prod-p16.jpg', 'Pure silk hair scarf', 0),
  ('silk-hair-scarf', '/images/products/prod-p16-b.jpg', 'Pure silk hair scarf detail', 1)
) as v(slug, url, alt, position) on v.slug = p.slug
where not exists (
  select 1 from product_images pi where pi.product_id = p.id and pi.position = v.position
);
