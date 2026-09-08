-- =============================================================================
-- NEXORA — clear stock category images (2026-09-08)
-- =============================================================================
-- Run in the Supabase SQL Editor for project vmclvqqovoazylisogin.
--
-- The 8 category cards were all using the same generic AI-stock photos
-- (image column pointing at /images/categories/cat-*.jpg). The code has been
-- updated so that when a category's `image` is empty, the card renders a
-- clean on-brand gradient + icon tile instead of a photo — no broken images.
-- This just clears that column so the live site picks up the new look.
--
-- Safe to re-run.
-- =============================================================================

update categories set image = '';

-- Sanity check — image should be blank for all 8 rows:
select slug, name, image from categories order by sort_order;
