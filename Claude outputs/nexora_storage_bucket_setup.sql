-- NEXORA — set up direct product-image uploads (Supabase Storage)
-- Run this once in the Supabase SQL Editor (project vmclvqqovoazylisogin).
--
-- WHAT THIS DOES
--   1. Creates a public storage bucket called "product-images".
--   2. Lets anyone with your site's public (anon) key upload/replace/delete
--      files in that bucket, and lets anyone view the files in it.
--
-- WHY IT'S SET UP THIS WAY (READ BEFORE RUNNING)
--   Your admin dashboard login today is a simple password check built into
--   the page itself — it does not log the admin into Supabase. That means
--   Supabase has no way to tell "this upload came from my real admin" apart
--   from "this upload came from anyone who has my site open." Your products
--   and categories tables already work this same way in this project.
--
--   So this bucket is intentionally open: it does NOT require a real login
--   to upload to. This matches your current security level and lets the
--   upload button work today. It is scoped tightly though — this policy
--   only touches the "product-images" bucket. It cannot be used to read or
--   change your products, orders, categories, or customer data.
--
--   If you later want uploads locked to only real, logged-in admins, that
--   requires wiring up actual Supabase Auth for /admin (replacing today's
--   password-only check) — a bigger change than today's request. Ask any
--   time and this can be tightened to match.

begin;

-- 1. Create the bucket (safe to re-run).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- 2. Allow anyone to VIEW files in this bucket (needed so product photos
--    show up on the storefront and in the admin dashboard).
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 3. Allow uploads into this bucket (the actual "Upload Image" button).
drop policy if exists "Anyone can upload product images" on storage.objects;
create policy "Anyone can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- 4. Allow replacing/overwriting a file with the same name.
drop policy if exists "Anyone can update product images" on storage.objects;
create policy "Anyone can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

-- 5. Allow removing a file (so the admin can swap out a bad photo).
drop policy if exists "Anyone can delete product images" on storage.objects;
create policy "Anyone can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');

commit;

-- Sanity check — should show the new bucket:
select id, name, public from storage.buckets where id = 'product-images';
