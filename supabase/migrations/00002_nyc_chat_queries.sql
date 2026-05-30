-- NYC Tech Week chatbot — query analytics log
-- Privacy posture: query text + timestamp only. No IP, no user id, no
-- identifiers of any kind. Anonymous usage analytics for the public /nyc bot.

create table public.nyc_chat_queries (
  id          bigint generated always as identity primary key,
  query       text not null,
  -- coarse signals that don't identify anyone:
  turn_index  int,           -- how deep in the conversation this message was
  created_at  timestamptz not null default now()
);

create index nyc_chat_queries_created_at_idx
  on public.nyc_chat_queries (created_at desc);

-- Writes happen server-side with the service-role key (bypasses RLS).
-- Lock the table down for everyone else: no anon/auth access at all.
alter table public.nyc_chat_queries enable row level security;
-- (No policies = no access for anon or authenticated roles. Service role only.)
