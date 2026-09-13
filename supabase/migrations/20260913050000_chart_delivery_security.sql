create table if not exists public.natal_charts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  birth_date date not null,
  birth_time text not null,
  birth_place text not null,
  chart_data jsonb not null,
  calculated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.natal_charts enable row level security;
drop policy if exists "Users can read own natal chart" on public.natal_charts;
drop policy if exists "Users can insert own natal chart" on public.natal_charts;
drop policy if exists "Users can update own natal chart" on public.natal_charts;
create policy "Users can read own natal chart" on public.natal_charts for select using (auth.uid() = user_id);
create policy "Users can insert own natal chart" on public.natal_charts for insert with check (auth.uid() = user_id);
create policy "Users can update own natal chart" on public.natal_charts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.report_deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id text not null,
  report_title text not null,
  report_markdown text not null,
  chart_data jsonb not null,
  stripe_session_id text,
  is_free boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, report_id)
);
create index if not exists report_deliveries_user_report_idx on public.report_deliveries(user_id, report_id);
alter table public.report_deliveries enable row level security;
drop policy if exists "Users can read own report deliveries" on public.report_deliveries;
create policy "Users can read own report deliveries" on public.report_deliveries for select using (auth.uid() = user_id);
