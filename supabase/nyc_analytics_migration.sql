-- NYC Tech Week — anonymous product analytics migration
-- Run this in the Supabase SQL editor BEFORE deploying the tracking code.
-- https://supabase.com/dashboard/project/grlzloqkonklbafjzlay/sql/new
--
-- Everything here is anonymous: a random first-party session id (UUID from the
-- visitor's localStorage). No IP, no email, no identity.

-- 1) Group chat turns into conversations
alter table nyc_chat_queries
  add column if not exists session_id text;

-- 2) RSVP click tracking — which events get clicked, from where (card vs chat)
create table if not exists nyc_rsvp_clicks (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  session_id  text,
  event_url   text not null,
  event_name  text,
  source      text            -- 'card' | 'chat' | 'unknown'
);

create index if not exists nyc_rsvp_clicks_created_at_idx
  on nyc_rsvp_clicks (created_at desc);
create index if not exists nyc_rsvp_clicks_event_url_idx
  on nyc_rsvp_clicks (event_url);

-- Lock the table down: only the service-role key (server-side) may read/write.
-- RLS on with no policies = anon/public clients get nothing.
alter table nyc_rsvp_clicks enable row level security;
