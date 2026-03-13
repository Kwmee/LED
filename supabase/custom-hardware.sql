alter table if exists public.projects
  drop constraint if exists projects_panel_id_fkey;

alter table if exists public.projects
  drop constraint if exists projects_processor_id_fkey;

alter table public.projects
  add column if not exists panel_source text not null default 'default';

alter table public.projects
  add column if not exists processor_source text not null default 'default';

alter table public.projects
  drop constraint if exists projects_panel_source_check;

alter table public.projects
  add constraint projects_panel_source_check
  check (panel_source in ('default', 'custom'));

alter table public.projects
  drop constraint if exists projects_processor_source_check;

alter table public.projects
  add constraint projects_processor_source_check
  check (processor_source in ('default', 'custom'));

create table if not exists public.custom_panels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  model text not null,
  pitch_mm numeric(6,2) not null,
  panel_width_mm integer not null,
  panel_height_mm integer not null,
  pixel_width integer not null,
  pixel_height integer not null,
  weight_kg numeric(8,2),
  power_max_w integer,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_processors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  model text not null,
  ports integer not null,
  pixels_per_port integer not null,
  max_pixels integer,
  created_at timestamptz not null default now()
);

alter table public.custom_panels enable row level security;
alter table public.custom_processors enable row level security;

create policy "Users can select own custom panels"
on public.custom_panels
for select
using (auth.uid() = user_id);

create policy "Users can insert own custom panels"
on public.custom_panels
for insert
with check (auth.uid() = user_id);

create policy "Users can update own custom panels"
on public.custom_panels
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own custom panels"
on public.custom_panels
for delete
using (auth.uid() = user_id);

create policy "Users can select own custom processors"
on public.custom_processors
for select
using (auth.uid() = user_id);

create policy "Users can insert own custom processors"
on public.custom_processors
for insert
with check (auth.uid() = user_id);

create policy "Users can update own custom processors"
on public.custom_processors
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own custom processors"
on public.custom_processors
for delete
using (auth.uid() = user_id);
