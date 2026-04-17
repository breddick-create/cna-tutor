-- Add product column to profiles to separate CNA and CCMA students
-- Existing rows default to 'cna' so no data is lost

alter table public.profiles
  add column if not exists product text not null default 'cna';

-- Constrain to known product values
alter table public.profiles
  drop constraint if exists profiles_product_check;

alter table public.profiles
  add constraint profiles_product_check
  check (product in ('cna', 'ccma'));

-- Index for efficient per-product admin queries
create index if not exists profiles_product_idx
  on public.profiles(product);

-- Compound index for the most common admin query pattern
create index if not exists profiles_product_role_idx
  on public.profiles(product, role);

-- RLS: CCMA students can only read their own profile (same policy logic as CNA,
-- the product column acts as a data partition not a security boundary —
-- row-level security is already enforced by the existing auth-based policies)

-- Backfill: mark any existing profiles that were created before this migration
-- as CNA so the product column reflects reality
update public.profiles
  set product = 'cna'
  where product is null or product = '';
