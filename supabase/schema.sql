create extension if not exists "pgcrypto";

create table if not exists public.panels (
  id text primary key,
  brand text not null,
  model text not null,
  width_mm integer not null,
  height_mm integer not null,
  pixel_width integer not null,
  pixel_height integer not null,
  pitch numeric(6,2) not null
);

create table if not exists public.processors (
  id text primary key,
  brand text not null,
  model text not null,
  max_pixels integer not null,
  ports integer not null,
  pixels_per_port integer not null default 650000
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  width_m numeric(8,2) not null,
  height_m numeric(8,2) not null,
  pitch numeric(6,2) not null,
  panel_id text not null references public.panels(id),
  processor_id text not null references public.processors(id),
  config_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Users can read own projects"
on public.projects
for select
using (auth.uid() = user_id);

create policy "Users can insert own projects"
on public.projects
for insert
with check (auth.uid() = user_id);
