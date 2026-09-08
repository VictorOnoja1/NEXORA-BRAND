-- =============================================================================
-- NEXORA — add 38 new products: perfumes, skincare, jewellery, luggage (2026-09-08)
-- =============================================================================
-- Run in the Supabase SQL Editor for project vmclvqqovoazylisogin, AFTER the
-- earlier 8-product script (wigs/hair-care/jewellery) has already run — that
-- one is confirmed live already, this is the rest of "this too" batch.
--
-- COVERS:
--   14 Perfumes   (NX-PF-016 .. NX-PF-029)
--    2 Skincare & Cosmetics (NX-SC-001, NX-SC-002) — first products in this
--      category, it was empty before
--    13 Jewellery  (NX-JW-008 .. NX-JW-020)
--    9 Accessories (NX-AC-001 .. NX-AC-009) — luggage/travel bags. There's no
--      dedicated "Luggage" category, so these use the existing (previously
--      empty) "accessories" category, which already exists in your DB.
--
-- WHAT WAS DELIBERATELY LEFT OUT (trademark/counterfeit risk):
--   - A styled flatlay photo with a genuine-looking CHANEL-labeled perfume
--     bottle and a watch with "CARTIER" printed on the dial, plus jewelry
--     styled after Cartier Love / Van Cleef Alhambra designs — excluded
--     entirely, not renamed.
--   - A Louis Vuitton monogram canvas duffel bag — excluded (repeat of an
--     earlier exclusion this session).
--   - A Jordan "Jumpman" logo patch on a Fendi-style monogram duffel bag —
--     excluded (repeat of an earlier exclusion).
--   - A "kensie" branded hardside luggage set (real, actively-sold brand
--     with its logo embossed on the case) — excluded.
--   A tray of small oil perfume bottles was hand-labeled with real designer
--   names (Armani, Burberry, Black Afgano, etc.) on what are clearly generic
--   oil dupes, not authentic bottles — these 5 were KEPT but renamed to
--   describe the scent family only (e.g. "Smoky Hashish Oud Attar Oil"); no
--   designer name appears anywhere in their listing.
--   One bottle in the VERLORNA mist lineup was printed "BOSS ORIGINAL" — the
--   VERLORNA-branded bottles were kept under VERLORNA's own name, but pull
--   that one Boss-labeled bottle physically before fulfilling orders from
--   this line, since it isn't described or sold under that name here.
--
-- IMAGES: all product images for this script are being copied into
-- public/images/products/ alongside this script — nothing else to fetch.
--
-- SAFE TO RE-RUN: "on conflict (slug) do nothing" + image-insert existence
-- guard, same pattern as the earlier scripts.
-- =============================================================================

begin;

insert into products
  (slug, name, category_slug, price, previous_price, description, short_description,
   stock, featured, is_new, is_best_seller, rating, rating_count, sku, created_at)
values

  ('24k-eau-de-parfum-collection', '24K Eau de Parfum Collection', 'perfumes', 26000, null,
    'Four bold statement scents in one lineup — Homme, Bleu Nuit, White and Rouge — each dressed in its own colour-coded box and gold-accented bottle. A confident, long-lasting eau de parfum for anyone who wants their fragrance to make an entrance without breaking the bank. Perfect as a gift set or for building out a personal collection one shade at a time.',
    'Four-scent boxed EDP collection in bold colour-coded bottles.', 10, true, true, false, null, 0, 'NX-PF-016', now()),

  ('riggs-london-icon-body-spray', 'RIGGS London ICON Body Spray', 'perfumes', 6000, null,
    'A sharp, generous 250ml perfumed body spray from RIGGS London carrying the brand''s signature heraldic crest, in the ICON scent. Long-lasting and easy to layer under a fragrance for extra staying power, it''s a solid everyday freshness option. Comes in RIGGS London''s clean white and red packaging that reads premium at a mass-market price.',
    'RIGGS London 250ml perfumed body spray, ICON scent.', 10, true, true, false, null, 0, 'NX-PF-017', now()),

  ('gkmen-for-men-eau-de-parfum', 'GKmen For Men Eau de Parfum', 'perfumes', 14000, null,
    'A clean, frosted-glass 50ml eau de parfum for men with a silver cap and minimalist branding, boxed and ready to gift. GKmen For Men leans into a crisp, versatile scent profile that works for daily wear from office to evening. Great entry-level fragrance for customers who want a boxed EDP without the premium price tag.',
    'GKmen 50ml boxed eau de parfum for men.', 10, true, true, false, null, 0, 'NX-PF-018', now()),

  ('storm-elixir-body-spray-collection', 'STORM Elixir Body Spray Collection (Assorted)', 'perfumes', 5500, null,
    'STORM Elixir''s full 200ml body spray lineup, spanning nearly twenty moods from Aura and Athena to Amber Oud, Inferno and Mystique. Marketed as "more than a body spray, it''s an elixir," each can is perfumed and long-wearing, making this a great pick-and-choose range for customers who like variety. Sold as an assorted pick — customer receives one can per purchase from the available scent list.',
    'Assorted 200ml STORM Elixir perfumed body sprays, ~20 scents.', 10, true, true, false, null, 0, 'NX-PF-019', now()),

  ('verlorna-fragrance-mist-collection', 'VERLORNA Fragrance Mist Collection (Assorted)', 'perfumes', 6000, null,
    'A generous 250ml fragrance mist line from VERLORNA, offering a dozen distinct personalities — from Unpredictable Lady and Good Girl to Falling Angel and For Away — each in its own tall gold-capped bottle. Light, wearable and easy to reapply through the day, these mists are an accessible way to try several scent moods without committing to a full bottle. Sold as an assorted pick from the available lineup.',
    'Assorted 250ml VERLORNA fragrance mists, twelve scent options.', 10, true, true, false, null, 0, 'NX-PF-020', now()),

  ('mousuf-perfumed-body-spray-assorted', 'MOUSUF Perfumed Body Spray (Assorted)', 'perfumes', 5000, null,
    'A generous 200ml perfumed deodorant body spray from MOUSUF, available in Wardi, the original MOUSUF blend, and Ramadi — each in its own linen-textured can with Arabic-script branding. Long-lasting and wallet-friendly, it''s an easy daily-freshness add-on alongside a signature fragrance. Sold as an assorted pick from the three variants shown.',
    'MOUSUF 200ml perfumed body spray, three scent variants.', 10, true, true, false, null, 0, 'NX-PF-021', now()),

  ('dove-antiperspirant-spray-collection', 'Dove Antiperspirant Spray Collection (Assorted)', 'perfumes', 4500, null,
    'Genuine Dove antiperspirant sprays with 48-hour protection and Dove''s signature 1/4 moisturizers, in six scents including Mango Sunshine, Vanilla & Cocoa Butter, Lavender, Sheer Fresh, Apple & White Tea and Coconut. A trusted household name that customers already know and reach for, priced for everyday restocking. Sold as an assorted pick from the six scents shown.',
    'Dove 48h antiperspirant spray, assorted scents.', 10, true, true, false, null, 0, 'NX-PF-022', now()),

  ('holika-holika-aloe-99-soothing-gel', 'Holika Holika Aloe 99% Soothing Gel', 'skincare-cosmetics', 6500, null,
    'A cult-favourite Korean skincare staple — Holika Holika''s Aloe 99% Fresh Moisturizing Soothing Gel cools and hydrates skin with an organic complex and cooling soother, dermatologist tested. Multi-use as a face gel, after-sun soother, or light body moisturizer, it absorbs quickly without stickiness. A genuine, authentic K-beauty product that''s an easy first entry into the skincare-cosmetics range.',
    'Holika Holika Aloe 99% cooling, hydrating soothing gel.', 10, true, true, false, null, 0, 'NX-SC-001', now()),

  ('kormesic-hand-cream-gift-set', 'KORMESIC Hand Cream Gift Set', 'skincare-cosmetics', 6000, null,
    'A set of five fruit-and-botanical hand creams from KORMESIC — Avocado Oil, Green Tea Polyphenols, Strawberry Extract, Peach Extract and Lemon Essential Oil — each in a bright, travel-friendly tube. Formulated to nourish, smooth and lightly scent the hands, this set is a natural add-on sale or small gift item at checkout. Playful packaging makes it a strong impulse-buy for the skincare-cosmetics category.',
    'Set of five fruity KORMESIC hand creams.', 10, true, true, false, null, 0, 'NX-SC-002', now()),

  ('woody-oud-attar-oil', 'Woody Oud Attar Oil', 'perfumes', 3000, null,
    'A rich, resinous oud-forward attar oil in a small roll-on style glass bottle, part of an assorted tray of imported oil perfumes. Deep, woody and long-lasting on skin, it suits anyone who loves a bold Middle Eastern oud character without the cost of a boxed spray bottle.',
    'Small-bottle woody oud attar oil', 10, true, true, false, null, 0, 'NX-PF-023', now()),

  ('aromatic-leather-oud-attar-oil', 'Aromatic Leather Oud Attar Oil', 'perfumes', 3000, null,
    'A spicy, aromatic-woody attar oil with a warm leather-oud undertone, from the same assorted tray of small imported oil perfumes. A long-lasting, concentrated alternative to spray colognes for men who prefer a sharp aromatic-fougere character.',
    'Spicy aromatic leather-oud attar oil', 10, true, true, false, null, 0, 'NX-PF-024', now()),

  ('classic-trench-floral-attar-oil', 'Classic Trench Floral Attar Oil', 'perfumes', 2800, null,
    'A fresh floral-musk attar oil with soft powdery undertones, from the same assorted tray of small imported oil perfumes. Light and wearable for daytime, sold as a concentrated oil roll-on rather than a spray.',
    'Fresh floral musk attar oil', 10, true, true, false, null, 0, 'NX-PF-025', now()),

  ('smoky-hashish-oud-attar-oil', 'Smoky Hashish Oud Attar Oil', 'perfumes', 3500, null,
    'A dark, smoky oud attar oil with incense, leather and hashish-like resinous notes, from the same assorted tray of small imported oil perfumes. An intense, long-lasting scent for lovers of bold oriental fragrances.',
    'Dark smoky incense oud attar oil', 10, true, true, false, null, 0, 'NX-PF-026', now()),

  ('dark-floral-orchid-attar-oil', 'Dark Floral Orchid Attar Oil', 'perfumes', 3200, null,
    'A dark, spicy floral gourmand attar oil with black orchid and vanilla-musk facets, from the same assorted tray of small imported oil perfumes. Rich and sensual, worn a drop at a time.',
    'Dark spicy floral gourmand attar oil', 10, true, true, false, null, 0, 'NX-PF-027', now()),

  ('arabian-oud-musk-perfume-collection', 'Assorted Arabian Oud & Musk Eau de Parfum Collection', 'perfumes', 28000, null,
    'A curated assortment of boxed Arabian-style eau de parfum bottles (styles include Sensuous Night, Oud Simplicity, Desert Dew and Cream Velvet) featuring oud, musk and floral-gourmand profiles in premium glass bottles. Sold individually by scent; price shown is per bottle.',
    'Assorted boxed oud & musk perfume bottles', 10, true, true, false, null, 0, 'NX-PF-028', now()),

  ('nivea-roll-on-deodorant-collection', 'NIVEA Roll-On Deodorant Collection', 'perfumes', 4500, null,
    'Genuine NIVEA roll-on antiperspirant deodorants, 50ml, in a range of variants including Dry Impact, Dry Comfort, Cool Kick, Black & White Invisible, Deep and Silver Protect. 48-hour protection, sold assorted by variant.',
    'NIVEA roll-on deodorant, assorted variants', 10, true, true, false, null, 0, 'NX-PF-029', now()),

  ('assorted-gold-hoop-earrings-collection', 'Assorted Gold Hoop Earrings Collection', 'jewellery', 17500, null,
    'A generous flatlay lot of gold-tone hoop earrings in twenty distinct designs — twisted, ribbed, chunky, heart-shaped and textured hoops for every mood. Perfect for shoppers who want a rotating hoop wardrobe without buying one pair at a time. Each set ships as a mixed assortment, so no two days have to look the same.',
    'Mixed-design gold hoop earring lot, 20 pairs', 10, true, true, false, null, 0, 'NX-JW-008', now()),

  ('black-onyx-clover-3pc-jewelry-set', 'Black Onyx Clover 3-Piece Jewelry Set', 'jewellery', 14500, null,
    'A polished gold-tone set featuring black clover-shaped charms on a fine chain necklace, a matching bracelet, and a wraparound ring. The clean four-petal motif gives an elevated, timeless look that pairs easily with everyday or occasion wear. Necklace, bracelet and ring are sold together as one matching set.',
    'Gold-tone black clover necklace, bracelet & ring set', 10, true, true, false, null, 0, 'NX-JW-009', now()),

  ('gold-statement-earrings-mega-bundle', 'Gold Statement Earrings Mega Bundle', 'jewellery', 18000, null,
    'A show-stopping bulk bundle of oversized gold-tone statement earrings — shells, starfish, ginkgo leaves, bows, florals and sculptural hoops across two full display cards. Ideal for resellers or anyone who wants a full seasonal earring wardrobe in one purchase. Big, glossy and unmistakably eye-catching on every pair.',
    'Oversized gold statement earring bundle, two full cards', 10, true, true, false, null, 0, 'NX-JW-010', now()),

  ('clover-charm-bracelet-multicolor', 'Clover Charm Bracelet', 'jewellery', 7000, null,
    'A dainty gold-tone chain bracelet strung with four-petal clover charms, available in pink, burgundy, black, green and white. Lightweight enough for daily wear and elegant enough to layer with your other favourites. A small, sweet piece that adds a pop of colour to any wrist stack.',
    'Gold chain clover charm bracelet, multiple colours', 10, true, true, false, null, 0, 'NX-JW-011', now()),

  ('coastal-shell-starfish-earring-card', 'Coastal Shell & Starfish Earring Set', 'jewellery', 12000, null,
    'An ocean-inspired assortment of gold-tone earrings featuring scallop shells, ribbed teardrops, spiral snail shells, starfish and smooth hoops, all on one presentation card. The warm, high-shine finish gives a breezy, resort-ready feel to every look. A fun grab of coastal charm for the earring drawer.',
    'Gold shell, starfish & hoop earring assortment card', 10, true, true, false, null, 0, 'NX-JW-012', now()),

  ('sapphire-cz-bracelet-stack-set', 'Sapphire CZ Bracelet Stack Set', 'jewellery', 16000, null,
    'A luxe six-piece bracelet stack in gold-tone metal, mixing a heart-link bangle, an infinity chain with sapphire-blue stones, a bezel-set sapphire-blue tennis bracelet, a heart-and-flower chain, a leaf vine chain and a pavé rectangular link bracelet. Wear the full stack for a glamorous armful or split the pieces across different outfits. A ready-made statement for anyone who loves a full wrist.',
    'Six-piece gold bracelet stack with sapphire-blue accents', 10, true, true, false, null, 0, 'NX-JW-013', now()),

  ('crystal-pave-butterfly-bracelet-stack', 'Crystal Pavé Butterfly Bracelet Stack', 'jewellery', 13000, null,
    'A sparkling four-piece bracelet stack in gold-tone metal, combining a pavé cuff, a curb-chain bracelet with a crystal clover charm, a slim pavé bangle and a dangling crystal butterfly chain. The mix of textures and a touch of whimsy make this an easy everyday glam stack. Stacks beautifully alone or layered with other pieces.',
    'Gold pavé bracelet stack with crystal butterfly charm', 10, true, true, false, null, 0, 'NX-JW-014', now()),

  ('crystal-pave-bracelet-stack-set', 'Crystal Pavé Bracelet Stack Set', 'jewellery', 15500, null,
    'A dazzling six-piece gold-tone bracelet stack featuring a heart-link bangle, an infinity chain, an interlocking pavé link bracelet, a heart-and-flower chain, a leaf vine chain, and a pavé rectangular link bracelet — all finished with sparkling clear crystals. Perfect for anyone who wants maximum sparkle with zero effort. Wear the whole set together for an instant red-carpet wrist.',
    'Six-piece all-crystal gold bracelet stack set', 10, true, true, false, null, 0, 'NX-JW-015', now()),

  ('gold-flower-clover-necklace-earring-set', 'Gold Flower & Crystal Clover Drop Necklace & Earring Set', 'jewellery', 11000, null,
    'A romantic two-piece set pairing bold gold-tone flower stud earrings, each set with a single sparkling crystal, with a delicate lariat-style necklace ending in two crystal-paved clover drops. Feminine and refined, it moves easily from daywear to date night. Earrings and necklace are sold together for an effortless matching look.',
    'Gold flower earrings and crystal clover pendant necklace set', 10, true, true, false, null, 0, 'NX-JW-016', now()),

  ('gold-stacking-rings-set-20pc', 'Gold Stacking Rings Set (20-Piece)', 'jewellery', 14000, null,
    'A full hand''s worth of gold-tone stacking rings in twenty designs — hearts, waves, stars, crystals, twists and delicate bands — made for mixing, matching and building your own ring stack. Great value for anyone who loves layered rings across every finger. A ready-made ring wardrobe in one purchase.',
    'Twenty-piece assorted gold stacking ring set', 10, true, true, false, null, 0, 'NX-JW-017', now()),

  ('gold-pearl-earring-assortment-card', 'Gold & Pearl Earring Assortment Card', 'jewellery', 13500, null,
    'A generous nine-pair earring card in warm gold tone — ball studs, twisted hoops, chunky hoops, chain-link hoops, knot studs, heart studs and pearl studs — plus a bonus pearl stretch bracelet. A great-value bundle for building out a whole jewelry box in one go. Every pair has its own personality, from classic to statement.',
    'Nine-pair gold earring card plus pearl bracelet', 10, true, true, false, null, 0, 'NX-JW-018', now()),

  ('gold-statement-earrings-assortment-card', 'Gold Statement Earrings Assortment Card', 'jewellery', 12500, null,
    'Eight pairs of gold-tone statement earrings on individual display cards — floral petals, pearl-centred blooms, woven studs, fan drops, textured florals, feathered swirls, classic hoops and organic open ovals. A well-rounded mix that covers understated to bold in a single order. Each pair arrives on its own presentation card, ready to sell or gift.',
    'Eight-pair gold statement earring assortment, individually carded', 10, true, true, false, null, 0, 'NX-JW-019', now()),

  ('gold-earring-ring-assortment-bowl-set', 'Gold Earring & Ring Assortment Set', 'jewellery', 13000, null,
    'A bountiful mixed lot of gold-tone earrings and one ring, individually carded, spanning hearts, teardrop pearls, ball studs, open hoops, moon shapes and floral studs. A brilliant pick for stocking a full display or gifting an assortment of everyday favourites. No two cards in this bundle look alike.',
    'Mixed carded gold earring and ring lot', 10, true, true, false, null, 0, 'NX-JW-020', now()),

  ('cream-rose-gold-luggage-set', 'Cream & Rose Gold Hardside Luggage Set (2-Piece)', 'accessories', 29500, null,
    'Travel in style with this ribbed hardside luggage duo in soft cream, finished with rose-gold hardware and a matching top handle. The spacious check-in case pairs with a compact vanity case for essentials, both rolling smoothly on quiet spinner wheels. A pretty, photo-ready set for weekend trips or a first big journey.',
    'Cream hardside 2-piece luggage set with rose-gold trim', 10, true, true, false, null, 0, 'NX-AC-001', now()),

  ('black-ribbed-4-piece-luggage-set', 'Classic Black Ribbed Luggage Set (4-Piece)', 'accessories', 42000, null,
    'A complete four-piece hardside set covering every trip length, from a large checked case down to a neat top vanity case. The durable ribbed shell resists scuffs while smooth spinner wheels and telescoping handles make airport moves effortless. Sleek all-black styling that suits business travel or family holidays alike.',
    'Durable black hardside luggage set, 4 sizes in one', 10, true, true, false, null, 0, 'NX-AC-002', now()),

  ('navy-cream-weekender-duffel-bag', 'Navy & Cream Two-Tone Weekender Bag', 'accessories', 27000, null,
    'A polished weekender duffel in navy and cream with rich tan leather-look trim and gold-tone accents. Roomy enough for a short getaway, it carries comfortably by the double handles or the included shoulder strap. A refined pick for anyone who wants their carry-on to look as good as it packs.',
    'Navy and cream leather-trim weekender duffel bag', 10, true, true, false, null, 0, 'NX-AC-003', now()),

  ('blue-hardside-3-piece-luggage-set', 'Vivid Blue Hardside Luggage Set (3-Piece)', 'accessories', 34000, null,
    'Make your luggage easy to spot on the carousel with this vibrant blue three-piece hardside set. From large check-in to cabin-friendly carry-on, each case shares the same tough ribbed shell and smooth-rolling wheels. A great value bundle for families or frequent travellers who need a full range of sizes at once.',
    'Bright blue 3-piece hardside luggage bundle', 10, true, true, false, null, 0, 'NX-AC-004', now()),

  ('matte-black-minimalist-luggage-set', 'Matte Black Minimalist Luggage Set (2-Piece)', 'accessories', 31000, null,
    'Clean lines and a smooth matte-black finish give this two-piece set a modern, understated look that pairs with any wardrobe. The larger case and matching cabin case both roll on sturdy multi-directional wheels for effortless steering through busy terminals. Understated luggage for travellers who prefer quiet, timeless style.',
    'Sleek matte black minimalist 2-piece luggage set', 10, true, true, false, null, 0, 'NX-AC-005', now()),

  ('charcoal-grey-hardside-luggage-set', 'Charcoal Grey Hardside Luggage Set (2-Piece)', 'accessories', 28000, null,
    'A dependable charcoal grey duo that covers both checked and cabin travel in one purchase. The textured hardside shell hides scuffs well, while the retractable handle and spinner wheels keep the case gliding smoothly at your side. Practical, versatile luggage that fits business trips and holidays with equal ease.',
    'Practical charcoal grey 2-piece hardside luggage set', 10, true, true, false, null, 0, 'NX-AC-006', now()),

  ('mint-green-3-piece-luggage-set', 'Mint Green Hardside Luggage Set (3-Piece)', 'accessories', 35000, null,
    'Add a fresh pop of colour to your travels with this soft mint green three-piece set, dressed up with rose-gold zip pulls and handles. The trio covers checked, mid-size, and cabin needs, each case gliding on smooth spinner wheels. A pretty, coordinated set that stands out beautifully at check-in.',
    'Fresh mint green 3-piece luggage set, rose-gold trim', 10, true, true, false, null, 0, 'NX-AC-007', now()),

  ('blush-grey-kids-travel-set', 'Blush & Grey Travel Set with Bow Accents', 'accessories', 24000, null,
    'A charming grey and blush pink travel bundle featuring a backpack, a rolling carry-on, and two matching pouches, all finished with sweet bow details and gold-tone hardware. Perfect for a young traveller or as a thoughtful gift set for a special trip. Comes ready for a nameplate to be personalised.',
    'Grey and blush travel set with bow details', 10, true, true, false, null, 0, 'NX-AC-008', now()),

  ('dusty-rose-4-piece-luggage-set', 'Dusty Rose Hardside Luggage Set (4-Piece)', 'accessories', 40000, null,
    'A complete dusty rose luggage wardrobe with four coordinated sizes, from a large checked case down to a petite vanity case. Every piece features a sturdy 100% PP hardside shell, TSA-style combination lock, and quiet spinner wheels for smooth handling. A generous, gift-worthy set for travellers who like everything to match.',
    'Dusty rose 4-piece hardside luggage set, matching', 10, true, true, false, null, 0, 'NX-AC-009', now())

on conflict (slug) do nothing;


insert into product_images (product_id, url, alt, position)
select p.id, v.url, v.alt, 0
from (values

  ('24k-eau-de-parfum-collection', '/images/products/24k-eau-de-parfum-collection.jpg', '24K Eau de Parfum Collection'),
  ('riggs-london-icon-body-spray', '/images/products/riggs-london-icon-body-spray.jpg', 'RIGGS London ICON Body Spray'),
  ('gkmen-for-men-eau-de-parfum', '/images/products/gkmen-for-men-eau-de-parfum.jpg', 'GKmen For Men Eau de Parfum'),
  ('storm-elixir-body-spray-collection', '/images/products/storm-elixir-body-spray-collection.jpg', 'STORM Elixir Body Spray Collection (Assorted)'),
  ('verlorna-fragrance-mist-collection', '/images/products/verlorna-fragrance-mist-collection.jpg', 'VERLORNA Fragrance Mist Collection (Assorted)'),
  ('mousuf-perfumed-body-spray-assorted', '/images/products/mousuf-perfumed-body-spray-assorted.jpg', 'MOUSUF Perfumed Body Spray (Assorted)'),
  ('dove-antiperspirant-spray-collection', '/images/products/dove-antiperspirant-spray-collection.jpg', 'Dove Antiperspirant Spray Collection (Assorted)'),
  ('holika-holika-aloe-99-soothing-gel', '/images/products/holika-holika-aloe-99-soothing-gel.jpg', 'Holika Holika Aloe 99% Soothing Gel'),
  ('kormesic-hand-cream-gift-set', '/images/products/kormesic-hand-cream-gift-set.jpg', 'KORMESIC Hand Cream Gift Set'),
  ('woody-oud-attar-oil', '/images/products/woody-oud-attar-oil.jpg', 'Woody Oud Attar Oil'),
  ('aromatic-leather-oud-attar-oil', '/images/products/aromatic-leather-oud-attar-oil.jpg', 'Aromatic Leather Oud Attar Oil'),
  ('classic-trench-floral-attar-oil', '/images/products/classic-trench-floral-attar-oil.jpg', 'Classic Trench Floral Attar Oil'),
  ('smoky-hashish-oud-attar-oil', '/images/products/smoky-hashish-oud-attar-oil.jpg', 'Smoky Hashish Oud Attar Oil'),
  ('dark-floral-orchid-attar-oil', '/images/products/dark-floral-orchid-attar-oil.jpg', 'Dark Floral Orchid Attar Oil'),
  ('arabian-oud-musk-perfume-collection', '/images/products/arabian-oud-musk-perfume-collection.jpg', 'Assorted Arabian Oud & Musk Eau de Parfum Collection'),
  ('nivea-roll-on-deodorant-collection', '/images/products/nivea-roll-on-deodorant-collection.jpg', 'NIVEA Roll-On Deodorant Collection'),
  ('assorted-gold-hoop-earrings-collection', '/images/products/assorted-gold-hoop-earrings-collection.jpg', 'Assorted Gold Hoop Earrings Collection'),
  ('black-onyx-clover-3pc-jewelry-set', '/images/products/black-onyx-clover-3pc-jewelry-set.jpg', 'Black Onyx Clover 3-Piece Jewelry Set'),
  ('gold-statement-earrings-mega-bundle', '/images/products/gold-statement-earrings-mega-bundle.jpg', 'Gold Statement Earrings Mega Bundle'),
  ('clover-charm-bracelet-multicolor', '/images/products/clover-charm-bracelet-multicolor.jpg', 'Clover Charm Bracelet'),
  ('coastal-shell-starfish-earring-card', '/images/products/coastal-shell-starfish-earring-card.jpg', 'Coastal Shell & Starfish Earring Set'),
  ('sapphire-cz-bracelet-stack-set', '/images/products/sapphire-cz-bracelet-stack-set.jpg', 'Sapphire CZ Bracelet Stack Set'),
  ('crystal-pave-butterfly-bracelet-stack', '/images/products/crystal-pave-butterfly-bracelet-stack.jpg', 'Crystal Pavé Butterfly Bracelet Stack'),
  ('crystal-pave-bracelet-stack-set', '/images/products/crystal-pave-bracelet-stack-set.jpg', 'Crystal Pavé Bracelet Stack Set'),
  ('gold-flower-clover-necklace-earring-set', '/images/products/gold-flower-clover-necklace-earring-set.jpg', 'Gold Flower & Crystal Clover Drop Necklace & Earring Set'),
  ('gold-stacking-rings-set-20pc', '/images/products/gold-stacking-rings-set-20pc.jpg', 'Gold Stacking Rings Set (20-Piece)'),
  ('gold-pearl-earring-assortment-card', '/images/products/gold-pearl-earring-assortment-card.jpg', 'Gold & Pearl Earring Assortment Card'),
  ('gold-statement-earrings-assortment-card', '/images/products/gold-statement-earrings-assortment-card.jpg', 'Gold Statement Earrings Assortment Card'),
  ('gold-earring-ring-assortment-bowl-set', '/images/products/gold-earring-ring-assortment-bowl-set.jpg', 'Gold Earring & Ring Assortment Set'),
  ('cream-rose-gold-luggage-set', '/images/products/cream-rose-gold-luggage-set.jpg', 'Cream & Rose Gold Hardside Luggage Set (2-Piece)'),
  ('black-ribbed-4-piece-luggage-set', '/images/products/black-ribbed-4-piece-luggage-set.jpg', 'Classic Black Ribbed Luggage Set (4-Piece)'),
  ('navy-cream-weekender-duffel-bag', '/images/products/navy-cream-weekender-duffel-bag.jpg', 'Navy & Cream Two-Tone Weekender Bag'),
  ('blue-hardside-3-piece-luggage-set', '/images/products/blue-hardside-3-piece-luggage-set.jpg', 'Vivid Blue Hardside Luggage Set (3-Piece)'),
  ('matte-black-minimalist-luggage-set', '/images/products/matte-black-minimalist-luggage-set.jpg', 'Matte Black Minimalist Luggage Set (2-Piece)'),
  ('charcoal-grey-hardside-luggage-set', '/images/products/charcoal-grey-hardside-luggage-set.jpg', 'Charcoal Grey Hardside Luggage Set (2-Piece)'),
  ('mint-green-3-piece-luggage-set', '/images/products/mint-green-3-piece-luggage-set.jpg', 'Mint Green Hardside Luggage Set (3-Piece)'),
  ('blush-grey-kids-travel-set', '/images/products/blush-grey-kids-travel-set.jpg', 'Blush & Grey Travel Set with Bow Accents'),
  ('dusty-rose-4-piece-luggage-set', '/images/products/dusty-rose-4-piece-luggage-set.jpg', 'Dusty Rose Hardside Luggage Set (4-Piece)')

) as v(product_slug, url, alt)
join products p on p.slug = v.product_slug
where not exists (
  select 1 from product_images pi where pi.product_id = p.id and pi.url = v.url
);

commit;

-- Sanity check — should return 38 rows:

select category_slug, slug, name, sku, price from products where sku in ('NX-PF-016','NX-PF-017','NX-PF-018','NX-PF-019','NX-PF-020','NX-PF-021','NX-PF-022','NX-SC-001','NX-SC-002','NX-PF-023','NX-PF-024','NX-PF-025','NX-PF-026','NX-PF-027','NX-PF-028','NX-PF-029','NX-JW-008','NX-JW-009','NX-JW-010','NX-JW-011','NX-JW-012','NX-JW-013','NX-JW-014','NX-JW-015','NX-JW-016','NX-JW-017','NX-JW-018','NX-JW-019','NX-JW-020','NX-AC-001','NX-AC-002','NX-AC-003','NX-AC-004','NX-AC-005','NX-AC-006','NX-AC-007','NX-AC-008','NX-AC-009') order by category_slug, sku;
