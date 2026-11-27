-- ============================================================================
-- Voyago Holidays — Supabase PostgreSQL Schema & Seed Data (v1.0)
-- Paste this entire file into Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Profiles (Captures B2C Individual & B2B Corporate customer details on signup)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'B2C' check (role in ('B2C', 'B2B', 'SUPER_ADMIN', 'TRAVEL_OPS', 'FINANCE', 'SALES')),
  full_name text not null,
  email text not null unique,
  phone text not null,
  company_name text,
  gstin text,
  kyc_status text not null default 'NOT_REQUIRED' check (kyc_status in ('NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED')),
  kyc_doc_name text,
  dpdp_consent boolean not null default true,
  dpdp_consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Packages (Domestic & International curated catalog ₹10,000 - ₹5,00,000)
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null,
  scope text not null check (scope in ('Domestic', 'International')),
  cohort text not null check (cohort in ('Girls-only', 'Boys-only', 'Couple-friendly', 'Family-friendly', 'Bachelors-friendly')),
  theme text not null check (theme in ('Staycation', 'Adventurous', 'Religious', 'Sightseeing')),
  duration text not null,
  price_inr integer not null check (price_inr between 10000 and 500000),
  summary text not null,
  highlights jsonb not null default '[]'::jsonb,
  itinerary jsonb not null default '[]'::jsonb,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  visa_note text,
  gradient text not null default 'from-navy to-teal-brand',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Departures (Drives the zero-PII Live Booking Heat Map)
create table if not exists public.departures (
  id uuid primary key default gen_random_uuid(),
  package_slug text not null references public.packages(slug) on delete cascade,
  departure_date date not null,
  total_seats integer not null default 20,
  booked_seats integer not null default 0,
  cold_start_label text default 'Available',
  unique(package_slug, departure_date)
);

-- 4. Seat Locks (Atomic 15-minute checkout reservation timer)
create table if not exists public.seat_locks (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid references public.departures(id) on delete cascade,
  package_slug text not null,
  departure_date date not null,
  user_id uuid references public.profiles(id) on delete set null,
  seats_locked integer not null check (seats_locked > 0),
  expires_at timestamptz not null,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

-- 5. Bookings (B2C & B2B with Indian GST 5%, Int'l TCS & PAN compliance)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  customer_type text not null check (customer_type in ('B2C', 'B2B')),
  package_slug text not null,
  package_title text not null,
  scope text not null check (scope in ('Domestic', 'International')),
  cohort text not null,
  departure_date date not null,
  traveler_count integer not null,
  travelers jsonb not null default '[]'::jsonb,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  company_name text,
  gstin text,
  pan_number text,
  base_amount integer not null,
  b2b_discount integer not null default 0,
  gst_amount integer not null,
  tcs_amount integer not null default 0,
  grand_total integer not null,
  payment_method text not null check (payment_method in ('CARD', 'NETBANKING', 'UPI', 'NEFT_RTGS', 'CALLBACK_FALLBACK')),
  payment_status text not null default 'PENDING' check (payment_status in ('PENDING', 'PAID', 'PENDING_NEFT', 'FAILED', 'REFUNDED')),
  booking_status text not null default 'Confirmed' check (booking_status in ('Confirmed', 'Reserved — Pending Bank Settlement', 'ID Verification Pending', 'Completed', 'Cancelled')),
  gateway_order_id text,
  gateway_payment_id text,
  roster_csv_uploaded boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. Cohort ID Verifications (Mandatory 24-hr Gov ID check for Girls-only / Boys-only)
create table if not exists public.id_verifications (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null references public.bookings(booking_ref) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  traveler_name text not null,
  cohort text not null,
  doc_type text not null check (doc_type in ('Masked Aadhaar', 'Passport', 'Driving License')),
  doc_reference text not null,
  status text not null default 'Pending Review' check (status in ('Pending Review', 'Verified', 'Action Required')),
  sla_deadline timestamptz not null default (now() + interval '24 hours'),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 7. Customization Leads (< 2 business hours Telephonic Callback SLA)
create table if not exists public.customizations (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  traveler_type text not null check (traveler_type in ('B2C', 'B2B')),
  full_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  destinations text not null,
  travel_dates text not null,
  traveler_count integer not null default 2,
  budget_range text not null,
  cohort text,
  theme text,
  notes text,
  status text not null default 'New Lead' check (status in ('New Lead', 'Callback Completed', 'Payment Link Sent', 'Converted', 'Closed')),
  payment_link_url text,
  milestone_split text default 'Full Payment',
  sla_deadline timestamptz not null default (now() + interval '2 hours'),
  created_at timestamptz not null default now()
);

-- 8. Saved Trips (Early Auth Incentive)
create table if not exists public.saved_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_slug text not null,
  created_at timestamptz not null default now(),
  unique(user_id, package_slug)
);

-- 9. Post-Checkout Micro-Survey
create table if not exists public.post_checkout_surveys (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null,
  ease_rating integer not null check (ease_rating between 1 and 5),
  heatmap_useful text not null check (heatmap_useful in ('Yes, very helpful', 'Somewhat', 'Didn''t use it')),
  created_at timestamptz not null default now()
);

-- 10. Corporate Lookbook Leads
create table if not exists public.corporate_lookbook_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  work_email text not null,
  team_size text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row-Level Security (RLS) Policies
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.packages enable row level security;
alter table public.departures enable row level security;
alter table public.bookings enable row level security;
alter table public.id_verifications enable row level security;
alter table public.customizations enable row level security;
alter table public.saved_trips enable row level security;

-- Public read for active packages & anonymized departures (ZERO PII)
create policy "Public read packages" on public.packages for select using (is_active = true);
create policy "Public read departures" on public.departures for select using (true);

-- Profiles: users read/update their own profile
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Bookings & Saved Trips: users read/insert their own
create policy "Users view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users insert own bookings" on public.bookings for insert with check (auth.uid() = user_id or user_id is null);
create policy "Users manage saved trips" on public.saved_trips for all using (auth.uid() = user_id);

-- Customizations: anyone can submit, authenticated users view their own
create policy "Anyone can submit customization" on public.customizations for insert with check (true);
create policy "Users view own customizations" on public.customizations for select using (auth.uid() = user_id);

-- ID Verifications: users manage their own uploads
create policy "Users view own id verifications" on public.id_verifications for select using (auth.uid() = user_id);
create policy "Users submit id verifications" on public.id_verifications for insert with check (auth.uid() = user_id);

-- Auto-create profile trigger on Supabase Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, email, phone, company_name, gstin, kyc_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'B2C'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'gstin',
    case when coalesce(new.raw_user_meta_data->>'role', 'B2C') = 'B2B' then 'PENDING' else 'NOT_REQUIRED' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- Seed Data: 8 Launch Packages
-- ============================================================================
insert into public.packages (slug, title, location, scope, cohort, theme, duration, price_inr, summary, gradient)
values
  ('rishikesh-rafting-girls-escape', 'Rishikesh Whitewater & Café Retreat', 'Rishikesh, Uttarakhand', 'Domestic', 'Girls-only', 'Adventurous', '3N / 4D', 14500, 'Grade-III Ganga rafting, riverside yoga, Tapovan café hopping, and bonfire nights with a verified girls-only tribe.', 'from-teal-700 to-navy'),
  ('coorg-misty-coffee-staycation', 'Coorg Private Pool & Coffee Estate Staycation', 'Madikeri, Karnataka', 'Domestic', 'Couple-friendly', 'Staycation', '3N / 4D', 28000, 'Slow mornings in a private misty plantation villa, estate coffee walks, sunset viewpoints, and candlelit Kodava dining.', 'from-emerald-800 to-teal-700'),
  ('goa-beach-villa-bachelors', 'North Goa Yacht, Surf & Villa Weekender', 'Anjuna & Assagao, Goa', 'Domestic', 'Bachelors-friendly', 'Adventurous', '4N / 5D', 22500, 'Private pool villa stay, sunset Mandovi yacht charter, beginner surf session, and curated coastal nightlife.', 'from-orange-500 to-rose-600'),
  ('spiti-valley-boys-expedition', 'Spiti Valley High-Altitude Road Expedition', 'Kaza & Chandratal, Himachal', 'Domestic', 'Boys-only', 'Adventurous', '6N / 7D', 38000, 'High-altitude Himalayan overland expedition across Atal Tunnel, Key Monastery, Hikkim, and Chandratal stargazing.', 'from-slate-800 to-navy'),
  ('varanasi-ayodhya-family-yatra', 'Varanasi & Ayodhya Guided Heritage Yatra', 'Varanasi & Ayodhya, UP', 'Domestic', 'Family-friendly', 'Religious', '4N / 5D', 45000, 'Comfortable AC transfers, VIP Ganga Aarti boat viewing, Ram Janmabhoomi darshan assistance, and heritage walks.', 'from-amber-600 to-navy'),
  ('bali-ubud-nusapenida-couples', 'Bali Cliffs, Ubud Villas & Nusa Penida Escape', 'Ubud & Uluwatu, Indonesia', 'International', 'Couple-friendly', 'Sightseeing', '6N / 7D', 115000, 'Private pool villas in Ubud, Nusa Penida West Island tour, Uluwatu Kecak sunset, and floating breakfast experiences.', 'from-cyan-700 to-navy'),
  ('vietnam-highlights-girls-squad', 'Hanoi, Ha Long Bay & Da Nang Girls-Only Tour', 'Hanoi, Ha Long & Da Nang, Vietnam', 'International', 'Girls-only', 'Sightseeing', '7N / 8D', 92000, 'Overnight Ha Long Bay cruise, Hoi An lantern evenings, Ba Na Hills Golden Bridge, and curated Vietnamese food trails.', 'from-teal-600 to-indigo-900'),
  ('switzerland-italy-grand-family', 'Swiss Alps, Lake Como & Rome Grand Family Tour', 'Lucerne, Como & Rome, Europe', 'International', 'Family-friendly', 'Sightseeing', '10N / 11D', 465000, 'Scenic Swiss rail passes, Mt. Titlis excursion, Lake Como ferry cruise, Vatican Museums, and family-paced comfort.', 'from-blue-900 to-teal-700')
on conflict (slug) do nothing;
