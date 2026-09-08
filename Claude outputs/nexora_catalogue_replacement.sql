-- =============================================================================
-- NEXORA — Catalogue replacement (Sept 2026 rebrand)
-- =============================================================================
-- Run this ONCE in the Supabase SQL Editor (Project -> SQL Editor -> New Query
-- -> paste this whole file -> Run). It does two things, in order:
--   1. Removes every product currently in the live catalogue (product_images
--      cascades automatically via its FK) — this is the "remove the actual
--      products" step the owner asked for.
--   2. Inserts the 32 real products from the photos supplied, across the
--      existing 8 categories (no category changes needed — Wigs & Hair, Hair
--      Care, Skincare & Cosmetics, Perfumes, Jewellery, Attachments, Fashion,
--      Accessories already match the brand doc and are left untouched).
--
-- Before running: copy the 32 image files from the
-- nexora-catalogue-images.zip you were sent into BOTH
--   admin/public/images/products/  and  frontend/public/images/products/
-- (same filenames as used below) so the image URLs referenced here resolve.
-- Safe to re-run: it always starts by clearing the products table.
-- =============================================================================

begin;

delete from products;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('betres-fruits-perfume-set', 'BETRES Fruits Perfume Spray Set (Coco, Vainilla, Mora, Melón)', 'perfumes', 18000, null, 'A 4-piece monofragancia spray set from BETRES — Coco, Vainilla (Vanilla), Mora (Blackberry) and Melón (Melon), each 100ml. Pick your favourite scent note or collect the full set for a fragrance wardrobe that changes with your mood.', '4-piece 100ml spray set — Coco, Vainilla, Mora, Melón.', 14, true, true, false, 'NX-PF-001')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/betres-fruits-perfume-set.jpg', 'BETRES Fruits 4-piece perfume spray set', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('betres-melon-perfume', 'BETRES Melón Perfume Spray 100ml', 'perfumes', 6500, 7500, 'A crisp, juicy melon fragrance in BETRES'' signature 100ml glass bottle. Light enough for daily wear, sweet enough to be memorable.', 'Juicy melon fragrance, 100ml spray bottle.', 20, false, false, false, 'NX-PF-002')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/betres-melon-perfume.jpg', 'BETRES Melón perfume bottle', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('lasgidi-crush-body-mist', 'Kasgidi Crush Body Mist (Assorted: Juicy, Vanilla, Candy, Pinky, Gelato)', 'perfumes', 4000, null, 'The viral Kasgidi "Crush" body mist line in five playful scents — Juicy Crush, Vanilla Crush, Candy Crush, Pinky Crush and Gelato Crush, 100ml each. Tell us your pick when you order, or grab a few to mix and match.', '100ml body mist — tell us your Crush flavour at checkout.', 40, true, true, true, 'NX-PF-003')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/lasgidi-crush-body-mist.jpg', 'Kasgidi Crush body mist lineup, five flavours', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('kaly-eau-de-parfum-collection', 'KALY Eau de Parfum Collection (50ml, Boxed)', 'perfumes', 32000, null, 'KALY''s boxed 50ml eau de parfum range in jewel-cut bottles — fruity, gourmand and fresh notes including Eden Juicy Apple and Glory Days. A statement bottle for your vanity, gift-ready in its own box.', 'Boxed 50ml EDP, jewel-cut bottle — pick your notes.', 10, true, false, false, 'NX-PF-004')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/kaly-eau-de-parfum-collection.jpg', 'KALY eau de parfum boxed collection', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('confetti-london-deodorant-spray', 'Confetti London Perfumed Deodorant Body Spray', 'perfumes', 5000, null, 'Confetti London''s 8-shade perfumed deodorant body spray range — Wish, Chocolate, Blush, Maya, Maple, Pretty, Dear and Coral. 24hr freshness in a fun, colourful can.', 'Perfumed 24hr deodorant body spray — 8 scents to choose from.', 36, false, false, true, 'NX-PF-005')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/confetti-london-deodorant-spray.jpg', 'Confetti London deodorant body spray lineup', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('lasgidi-vanilla-crush-mist', 'Kasgidi Vanilla Crush Body Mist 100ml', 'perfumes', 4000, null, 'A warm, sweet vanilla body mist from the Kasgidi Crush line, 100ml. Layer it under your favourite perfume or wear it alone for an all-day cosy-sweet finish.', 'Warm vanilla body mist, 100ml.', 28, false, false, false, 'NX-PF-006')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/lasgidi-vanilla-crush-mist.jpg', 'Kasgidi Vanilla Crush body mist bottles', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('betres-mora-vainilla-trio', 'BETRES Mora, Vainilla & Monogotas Trio', 'perfumes', 15000, 17500, 'A three-piece BETRES set: Mora (Blackberry), Vainilla (Vanilla) and the concentrated Monogotas Vainilla oil — three ways to wear the same warm, fruity mood.', '3-piece set: Mora, Vainilla + concentrated Vainilla drops.', 12, false, false, false, 'NX-PF-007')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/betres-mora-vainilla-trio.jpg', 'BETRES Mora, Vainilla and Monogotas trio', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('lattafa-badee-al-oud-collection', 'Lattafa Badee Al Oud Eau de Parfum (100ml, Boxed)', 'perfumes', 55000, null, 'Lattafa''s celebrated Badee Al Oud line in ornate 100ml bottles with gold Arabic-diamond detailing — Oud For Glory, Amethyst, Sublime, Honor & Glory and Sheikh Zayed. Rich, long-lasting oud fragrances, boxed for gifting.', '100ml boxed oud EDP — five variants to choose from.', 8, true, false, true, 'NX-PF-008')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/lattafa-badee-al-oud-collection.jpg', 'Lattafa Badee Al Oud collection of five bottles', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('lattafa-badee-al-oud-sublime', 'Lattafa Badee Al Oud — Sublime (100ml, Gift Boxed)', 'perfumes', 68000, 75000, 'The Sublime edition of Lattafa''s Badee Al Oud, in its own display gift box with a window front. A soft blush bottle with the same gold diamond motif — an easy gifting choice.', 'Sublime edition, gift-boxed with display window.', 6, true, true, false, 'NX-PF-009')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/lattafa-badee-al-oud-sublime.jpg', 'Lattafa Badee Al Oud Sublime gift box', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('afnan-9pm-perfume', 'AFNAN 9pm Eau de Parfum 100ml', 'perfumes', 58000, null, 'AFNAN''s best-selling 9pm — a bold, smoky-sweet vanilla and spice fragrance in a sleek black bottle with a signature dome cap. A night-out staple.', 'Smoky-sweet vanilla & spice, 100ml, signature dome cap.', 9, false, false, true, 'NX-PF-010')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/afnan-9pm-perfume.jpg', 'AFNAN 9pm perfume bottle and box', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('afnan-9pm-rebel-perfume', 'AFNAN 9pm Rebel Eau de Parfum 100ml', 'perfumes', 62000, null, 'The red-hot Rebel edition of AFNAN''s 9pm — a sharper, spicier twist on the original in a striking crimson bottle. For a bolder night out.', 'Sharper, spicier twist on 9pm — crimson bottle, 100ml.', 7, false, true, false, 'NX-PF-011')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/afnan-9pm-rebel-perfume.jpg', 'AFNAN 9pm Rebel perfume bottle and box', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('kaly-travel-trio', 'KALY Travel-Size Trio (Eden, Pistachio Gelato, Glory Days)', 'perfumes', 20000, null, 'Three KALY favourites in a more travel-friendly 30ml size — Eden Juicy Apple, Yum Pistachio Gelato and Glory Days. Perfect for trying the range or keeping one in your bag.', '3 x 30ml — Eden, Pistachio Gelato, Glory Days.', 15, false, false, false, 'NX-PF-012')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/kaly-travel-trio.jpg', 'KALY travel-size trio held in hand', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('riggs-london-body-spray-1', 'RIGGS London Perfumed Body Spray (Assorted, 250ml)', 'perfumes', 5500, null, 'RIGGS London''s men''s perfumed body spray line — Hour, Rock, Oud, Pink, Venom, Echo, Hero, Power, The One, Gear, Rider, West and Dynamo, 150-250ml. Tell us your scent when you order.', '150-250ml perfumed body spray — 13 scents to pick from.', 48, false, false, true, 'NX-PF-013')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/riggs-london-body-spray-1.jpg', 'RIGGS London body spray range, first lineup', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('mousuf-fragrance-boxes', 'MOUSUF Fragrance (Boxed, Assorted Colours)', 'perfumes', 12000, null, 'MOUSUF''s minimalist boxed fragrance line in six colourways — pink, tan, white, blue, black and red. A clean, understated bottle for everyday wear.', 'Boxed fragrance, 6 colourways to choose from.', 18, false, false, false, 'NX-PF-014')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/mousuf-fragrance-boxes.jpg', 'MOUSUF fragrance boxes stacked, six colours', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('riggs-london-body-spray-2', 'RIGGS London Perfumed Body Spray (Assorted, 200ml)', 'perfumes', 5500, null, 'A second RIGGS London lineup — Icon, Voyage, Power, Chief, Gear, Rider, West, Dynamo, Night, Ice and more. Same 24hr perfumed formula, more scents to choose from.', '200ml perfumed body spray — 14 scents to pick from.', 44, false, false, false, 'NX-PF-015')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/riggs-london-body-spray-2.jpg', 'RIGGS London body spray range, second lineup', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('silky-straight-lace-bob-wig', 'Silky Straight Lace Front Bob Wig', 'wigs-hair', 45000, 52000, 'A sleek, silky straight bob in a lace front construction with a natural centre part and hairline. Pre-styled, glueless-friendly, ready to wear straight out of the pack.', 'Lace front bob, silky straight, natural centre part.', 10, true, true, true, 'NX-WG-001')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/silky-straight-lace-bob-wig.jpg', 'Silky straight lace front bob wig, model wearing', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('hd-lace-slick-bob-wig', 'HD Lace Slick-Back Bob Wig', 'wigs-hair', 42000, null, 'A slicked-back bob on an HD lace front for the most natural, undetectable hairline — mannequin-styled here to show the lace clarity up close.', 'HD lace front, slicked-back styling, undetectable hairline.', 9, false, false, false, 'NX-WG-002')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/hd-lace-slick-bob-wig.jpg', 'HD lace slick-back bob wig on mannequin', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('bob-wig-with-bangs', 'Blunt Bob Wig with Micro Fringe Bangs', 'wigs-hair', 38000, null, 'A blunt-cut bob finished with soft micro-fringe bangs, lace-front construction for a natural part. Shown here in two finishes so you can compare fringe styles.', 'Blunt bob with soft micro-fringe bangs, lace front.', 11, false, true, false, 'NX-WG-003')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/bob-wig-with-bangs.jpg', 'Two blunt bob wigs with bangs, side by side', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('10inch-2x6-lace-bob-wig', '10" 2x6 Closure Bob Wig', 'wigs-hair', 40000, null, 'A 10-inch bob on a 2x6 lace closure — smaller lace area than a full frontal, quicker to install, still gives a natural, melted hairline. Straight, glossy finish.', '10-inch, 2x6 closure, straight & glossy.', 13, false, false, true, 'NX-WG-004')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/10inch-2x6-lace-bob-wig.jpg', '10 inch 2 by 6 closure bob wig', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('ginger-curly-pixie-wig', 'Ginger Curly Pixie Wig', 'wigs-hair', 35000, null, 'A short, voluminous pixie cut in a warm ginger curl — full glam texture that holds its curl pattern with everyday styling.', 'Short pixie cut, warm ginger curls.', 8, true, true, false, 'NX-WG-005')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/ginger-curly-pixie-wig.jpg', 'Ginger curly pixie wig, side profile', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('curly-pixie-lace-wig', 'Curly Pixie Lace Front Wig', 'wigs-hair', 37000, null, 'A natural black curly pixie on a lace front, showing off the lace clarity and curl definition from the side. Low-manipulation and easy to maintain.', 'Lace front curly pixie, natural black.', 10, false, false, false, 'NX-WG-006')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/curly-pixie-lace-wig.jpg', 'Curly pixie lace front wig, side view showing lace', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('burgundy-curly-bob-wig', 'Burgundy Curly Bob Lace Wig', 'wigs-hair', 48000, 54000, 'A rich wine-burgundy curly bob on a lace front — full, bouncy curls with a soft fringe. A standout colour choice for anyone ready to go bold.', 'Wine-burgundy curls, lace front bob, soft fringe.', 7, true, false, true, 'NX-WG-007')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/burgundy-curly-bob-wig.jpg', 'Burgundy curly bob lace wig, side profile', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('glam-curly-pixie-wig', 'Glam Curly Pixie Wig', 'wigs-hair', 39000, null, 'A polished, salon-styled curly pixie with defined ringlets — full glam finish, great for events or anytime you want instant volume.', 'Salon-styled curly pixie, defined ringlets.', 9, false, false, false, 'NX-WG-008')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/glam-curly-pixie-wig.jpg', 'Glam curly pixie wig, styled with makeup', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('gold-pentagon-stud-earrings-card', 'Gold-Tone Pentagon Stud Earrings (12-Pair Card)', 'jewellery', 8000, null, 'A full card of 12 pairs of textured gold-tone pentagon stud earrings — great value for stocking up or gifting. Nickel-free costume jewellery finish.', '12 pairs per card, textured gold-tone pentagon studs.', 20, false, false, true, 'NX-JW-001')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/gold-pentagon-stud-earrings-card.jpg', 'Card of 12 pairs of gold-tone pentagon stud earrings', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('gold-ball-necklace-earring-set', 'Gold-Tone Ball Necklace & Earring Set', 'jewellery', 9500, null, 'A dainty gold-tone chain necklace with three brushed-gold ball charms, paired with matching drop earrings. Simple enough for daily wear.', 'Chain necklace with 3 ball charms + matching earrings.', 16, false, false, false, 'NX-JW-002')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/gold-ball-necklace-earring-set.jpg', 'Gold-tone ball necklace and earring set', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('gold-ball-4pc-jewellery-set', 'Gold-Tone Ball 4-Piece Jewellery Set', 'jewellery', 15000, 17000, 'A 4-piece gold-tone set — necklace, stud earrings, an open cuff bangle and a matching ring, all finished with the same polished ball motif. Great as a gift set.', 'Necklace + earrings + bangle + ring, matching ball motif.', 10, true, true, false, 'NX-JW-003')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/gold-ball-4pc-jewellery-set.jpg', 'Gold-tone 4-piece jewellery set with ball motif', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('denim-flower-drop-earrings', 'Denim Fabric Flower Drop Earrings', 'jewellery', 4500, null, 'Oversized fabric flower earrings in a soft denim finish — a fun, textural statement piece that''s surprisingly lightweight to wear.', 'Oversized fabric flower earrings, denim finish.', 18, false, true, false, 'NX-JW-004')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/denim-flower-drop-earrings.jpg', 'Denim fabric flower drop earrings', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('matte-black-statement-earrings', 'Matte Black Graduated Ball Drop Earrings', 'jewellery', 6000, null, 'Bold, graduated matte-black ball drop earrings — a modern statement piece that pairs easily with both everyday and evening looks.', 'Graduated matte-black ball drops, statement size.', 14, true, false, false, 'NX-JW-005')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/matte-black-statement-earrings.jpg', 'Matte black graduated ball drop earrings', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('amber-onyx-gold-stud-earrings', 'Amber & Onyx Gold-Tone Stud Earrings', 'jewellery', 7500, null, 'Two-tone cabochon stud earrings pairing a deep onyx-black stone with a warm amber stone, set in a polished gold-tone frame — an elegant everyday statement stud.', 'Onyx + amber cabochon studs, gold-tone setting.', 12, false, false, false, 'NX-JW-006')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/amber-onyx-gold-stud-earrings.jpg', 'Amber and onyx gold-tone stud earrings', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('pearl-embellished-headband', 'Pearl-Embellished Ribbed Headband', 'attachments', 4000, null, 'A soft ribbed knit headband scattered with faux pearls, finished with a twist-knot detail — an easy way to dress up second-day hair.', 'Ribbed knit headband with faux pearl detailing.', 22, false, false, false, 'NX-AT-001')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/pearl-embellished-headband.jpg', 'Pearl-embellished ribbed headband', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('barbie-star-hair-clip-set', 'Barbie-Style Star Hair Clip Set (5-Piece)', 'attachments', 2500, null, 'A playful 5-piece hair clip set in pink and black tones, with star and bow charms and a glossy "Barbie"-lettered clip — a fun add-on for younger customers or playful everyday styling.', '5-piece pink & black star/bow hair clip set.', 30, false, true, true, 'NX-AT-002')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/barbie-star-hair-clip-set.jpg', 'Barbie-style star hair clip 5-piece set', 0 from p;

with p as (
  insert into products (slug, name, category_slug, price, previous_price, description, short_description, stock, featured, is_new, is_best_seller, sku)
  values ('satin-scrunchie-7pack', 'Silky Satin Scrunchie Set (7-Piece)', 'attachments', 5000, null, 'Seven silky satin scrunchies in a rich jewel-tone colourway — gentle on hair, no creasing, and a set big enough to match every outfit.', '7 satin scrunchies, jewel-tone colourway.', 25, false, false, false, 'NX-AT-003')
  returning id
)
insert into product_images (product_id, url, alt, position)
select id, '/images/products/satin-scrunchie-7pack.jpg', 'Set of 7 silky satin scrunchies', 0 from p;

commit;

-- Expect: 32 rows in products, 32 rows in product_images afterward.
select (select count(*) from products) as product_count, (select count(*) from product_images) as image_count;