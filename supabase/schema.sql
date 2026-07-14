-- ALIVEMAEX · Landing-Backend
-- Einmalig im Supabase SQL Editor ausführen (Projekt deiner Wahl).
-- Zugriff läuft nur über den Service-Role-Key in den Vercel-Serverless-Functions;
-- RLS bleibt an, ohne Policies → anon/authenticated kommen nicht ran.

create table if not exists public.alivemaex_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  locale text,
  created_at timestamptz not null default now()
);

alter table public.alivemaex_signups enable row level security;

create table if not exists public.alivemaex_events (
  id bigint generated always as identity primary key,
  event text not null,
  path text,
  referrer_host text,
  device text,
  created_at timestamptz not null default now()
);

alter table public.alivemaex_events enable row level security;

create index if not exists alivemaex_events_event_created_idx
  on public.alivemaex_events (event, created_at desc);
