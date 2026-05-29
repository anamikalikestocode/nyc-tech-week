-- L'Ami Mauricien — initial schema
-- Run against a Supabase project (Postgres 15+)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp" with schema extensions;

-- ---------------------------------------------------------------------------
-- ENUM types
-- ---------------------------------------------------------------------------
create type public.user_role    as enum ('traveller', 'partner', 'admin');
create type public.partner_status as enum ('pending', 'approved', 'rejected');
create type public.price_range  as enum ('$', '$$', '$$$', '$$$$');
create type public.media_type   as enum ('image', 'video');
create type public.lead_status  as enum ('new', 'contacted', 'converted', 'closed');
create type public.message_role as enum ('user', 'assistant', 'system');

-- ---------------------------------------------------------------------------
-- profiles — extends auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        public.user_role not null default 'traveller',
  locale      text not null default 'en' check (locale in ('en', 'fr')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- regions
-- ---------------------------------------------------------------------------
create table public.regions (
  id          uuid primary key default extensions.uuid_generate_v4(),
  slug        text unique not null,
  name_en     text not null,
  name_fr     text not null,
  description_en text,
  description_fr text,
  hero_image  text,
  display_order int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default extensions.uuid_generate_v4(),
  slug        text unique not null,
  name_en     text not null,
  name_fr     text not null,
  icon        text,
  display_order int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
create table public.tags (
  id          uuid primary key default extensions.uuid_generate_v4(),
  slug        text unique not null,
  name_en     text not null,
  name_fr     text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- partners — the core entity
-- ---------------------------------------------------------------------------
create table public.partners (
  id               uuid primary key default extensions.uuid_generate_v4(),
  slug             text unique not null,
  name             text not null,
  description_en   text,
  description_fr   text,
  short_desc_en    text,
  short_desc_fr    text,
  category_id      uuid not null references public.categories(id),
  region_id        uuid not null references public.regions(id),
  price_range      public.price_range not null default '$$',
  signature_offers jsonb default '[]'::jsonb,
  address          text,
  latitude         double precision,
  longitude        double precision,
  phone            text,
  email            text,
  website          text,
  hero_image       text,
  quality_score    int not null default 80 check (quality_score between 0 and 100),
  status           public.partner_status not null default 'pending',
  owner_id         uuid references auth.users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_partners_category on public.partners(category_id);
create index idx_partners_region   on public.partners(region_id);
create index idx_partners_status   on public.partners(status);

-- ---------------------------------------------------------------------------
-- partner_media
-- ---------------------------------------------------------------------------
create table public.partner_media (
  id          uuid primary key default extensions.uuid_generate_v4(),
  partner_id  uuid not null references public.partners(id) on delete cascade,
  url         text not null,
  media_type  public.media_type not null default 'image',
  alt_text    text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_partner_media_partner on public.partner_media(partner_id);

-- ---------------------------------------------------------------------------
-- partner_tags (many-to-many)
-- ---------------------------------------------------------------------------
create table public.partner_tags (
  partner_id uuid not null references public.partners(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  primary key (partner_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- editorial_collections
-- ---------------------------------------------------------------------------
create table public.editorial_collections (
  id            uuid primary key default extensions.uuid_generate_v4(),
  slug          text unique not null,
  title_en      text not null,
  title_fr      text not null,
  subtitle_en   text,
  subtitle_fr   text,
  description_en text,
  description_fr text,
  hero_image    text,
  display_order int not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- collection_partners (many-to-many, ordered)
-- ---------------------------------------------------------------------------
create table public.collection_partners (
  collection_id uuid not null references public.editorial_collections(id) on delete cascade,
  partner_id    uuid not null references public.partners(id) on delete cascade,
  sort_order    int not null default 0,
  primary key (collection_id, partner_id)
);

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
create table public.conversations (
  id            uuid primary key default extensions.uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  anon_session  text,
  title         text,
  locale        text not null default 'en',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_conversations_user on public.conversations(user_id);
create index idx_conversations_anon on public.conversations(anon_session);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
create table public.messages (
  id              uuid primary key default extensions.uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            public.message_role not null,
  content         text not null,
  tool_calls      jsonb,
  feedback        smallint check (feedback in (-1, 0, 1)),
  created_at      timestamptz not null default now()
);

create index idx_messages_conversation on public.messages(conversation_id);

-- ---------------------------------------------------------------------------
-- itineraries
-- ---------------------------------------------------------------------------
create table public.itineraries (
  id            uuid primary key default extensions.uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  anon_session  text,
  title         text not null,
  description   text,
  start_date    date,
  end_date      date,
  share_token   text unique default encode(extensions.uuid_generate_v4()::bytea, 'hex'),
  locale        text not null default 'en',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_itineraries_user  on public.itineraries(user_id);
create index idx_itineraries_share on public.itineraries(share_token);

-- ---------------------------------------------------------------------------
-- itinerary_days
-- ---------------------------------------------------------------------------
create table public.itinerary_days (
  id            uuid primary key default extensions.uuid_generate_v4(),
  itinerary_id  uuid not null references public.itineraries(id) on delete cascade,
  day_number    int not null,
  title         text,
  notes         text,
  created_at    timestamptz not null default now()
);

create index idx_itinerary_days on public.itinerary_days(itinerary_id);

-- ---------------------------------------------------------------------------
-- itinerary_items
-- ---------------------------------------------------------------------------
create table public.itinerary_items (
  id             uuid primary key default extensions.uuid_generate_v4(),
  day_id         uuid not null references public.itinerary_days(id) on delete cascade,
  partner_id     uuid references public.partners(id) on delete set null,
  title          text not null,
  description    text,
  time_slot      text,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

create index idx_itinerary_items_day on public.itinerary_items(day_id);

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table public.leads (
  id            uuid primary key default extensions.uuid_generate_v4(),
  partner_id    uuid not null references public.partners(id) on delete cascade,
  user_id       uuid references auth.users(id) on delete set null,
  itinerary_id  uuid references public.itineraries(id) on delete set null,
  name          text not null,
  email         text not null,
  phone         text,
  message       text,
  travel_dates  text,
  group_size    int,
  status        public.lead_status not null default 'new',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_leads_partner on public.leads(partner_id);
create index idx_leads_status  on public.leads(status);

-- ---------------------------------------------------------------------------
-- Row Level Security — basic policies
-- ---------------------------------------------------------------------------

-- profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- regions, categories, tags — public read
alter table public.regions enable row level security;
create policy "Public read regions" on public.regions for select using (true);

alter table public.categories enable row level security;
create policy "Public read categories" on public.categories for select using (true);

alter table public.tags enable row level security;
create policy "Public read tags" on public.tags for select using (true);

-- partners — public read approved only
alter table public.partners enable row level security;
create policy "Public read approved partners"
  on public.partners for select using (status = 'approved');
create policy "Partners can update own listing"
  on public.partners for update using (auth.uid() = owner_id);

-- partner_media — public read
alter table public.partner_media enable row level security;
create policy "Public read partner media"
  on public.partner_media for select using (true);

-- partner_tags — public read
alter table public.partner_tags enable row level security;
create policy "Public read partner tags"
  on public.partner_tags for select using (true);

-- editorial_collections — public read published
alter table public.editorial_collections enable row level security;
create policy "Public read published collections"
  on public.editorial_collections for select using (published = true);

-- collection_partners — public read
alter table public.collection_partners enable row level security;
create policy "Public read collection partners"
  on public.collection_partners for select using (true);

-- conversations — own only
alter table public.conversations enable row level security;
create policy "Users can view own conversations"
  on public.conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations"
  on public.conversations for insert with check (auth.uid() = user_id);

-- messages — via conversation ownership
alter table public.messages enable row level security;
create policy "Users can view own messages"
  on public.messages for select using (
    conversation_id in (select id from public.conversations where user_id = auth.uid())
  );

-- itineraries — own or shared
alter table public.itineraries enable row level security;
create policy "Users can view own itineraries"
  on public.itineraries for select using (auth.uid() = user_id);
create policy "Users can insert own itineraries"
  on public.itineraries for insert with check (auth.uid() = user_id);
create policy "Users can update own itineraries"
  on public.itineraries for update using (auth.uid() = user_id);

-- itinerary_days — via itinerary ownership
alter table public.itinerary_days enable row level security;
create policy "Users can manage own itinerary days"
  on public.itinerary_days for all using (
    itinerary_id in (select id from public.itineraries where user_id = auth.uid())
  );

-- itinerary_items — via day→itinerary ownership
alter table public.itinerary_items enable row level security;
create policy "Users can manage own itinerary items"
  on public.itinerary_items for all using (
    day_id in (
      select d.id from public.itinerary_days d
      join public.itineraries i on d.itinerary_id = i.id
      where i.user_id = auth.uid()
    )
  );

-- leads — partner sees their leads, user sees their own
alter table public.leads enable row level security;
create policy "Partners can view their leads"
  on public.leads for select using (
    partner_id in (select id from public.partners where owner_id = auth.uid())
  );
create policy "Users can view own leads"
  on public.leads for select using (auth.uid() = user_id);
create policy "Anyone can insert leads"
  on public.leads for insert with check (true);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_partners_updated_at
  before update on public.partners for each row execute function public.set_updated_at();
create trigger set_conversations_updated_at
  before update on public.conversations for each row execute function public.set_updated_at();
create trigger set_itineraries_updated_at
  before update on public.itineraries for each row execute function public.set_updated_at();
create trigger set_leads_updated_at
  before update on public.leads for each row execute function public.set_updated_at();
