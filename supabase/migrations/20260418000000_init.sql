-- ============================================================
-- LifeBalance — initial schema
-- ============================================================

-- --------------------------------------------------------
-- profiles (1-to-1 with auth.users)
-- --------------------------------------------------------
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text,
  name             text,
  avatar           text,
  preferences      jsonb not null default '{
    "theme": "system",
    "notifications": true,
    "reminderDay": 1,
    "language": "system",
    "haptics": true
  }'::jsonb,
  streak_days      int not null default 0,
  last_checkin_date date,
  created_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- --------------------------------------------------------
-- cycles (30-day life cycles)
-- --------------------------------------------------------
create table if not exists public.cycles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  start_date   timestamptz not null,
  end_date     timestamptz not null,
  scores       jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  label        text,
  notes        text,
  created_at   timestamptz not null default now()
);

create index if not exists cycles_user_active_idx
  on public.cycles (user_id, completed_at nulls first);

alter table public.cycles enable row level security;

create policy "Users can select own cycles"
  on public.cycles for select
  using (auth.uid() = user_id);

create policy "Users can insert own cycles"
  on public.cycles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cycles"
  on public.cycles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own cycles"
  on public.cycles for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------
-- weekly_pulses (1 per week per cycle, max 4)
-- --------------------------------------------------------
create table if not exists public.weekly_pulses (
  id          uuid primary key default gen_random_uuid(),
  cycle_id    uuid not null references public.cycles(id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 4),
  scores      jsonb not null default '{}'::jsonb,
  note        text,
  created_at  timestamptz not null default now(),
  unique (cycle_id, week_number)
);

alter table public.weekly_pulses enable row level security;

create policy "Users can select own weekly_pulses"
  on public.weekly_pulses for select
  using (
    auth.uid() = (
      select user_id from public.cycles where id = cycle_id
    )
  );

create policy "Users can insert own weekly_pulses"
  on public.weekly_pulses for insert
  with check (
    auth.uid() = (
      select user_id from public.cycles where id = cycle_id
    )
  );

create policy "Users can update own weekly_pulses"
  on public.weekly_pulses for update
  using (
    auth.uid() = (
      select user_id from public.cycles where id = cycle_id
    )
  )
  with check (
    auth.uid() = (
      select user_id from public.cycles where id = cycle_id
    )
  );

create policy "Users can delete own weekly_pulses"
  on public.weekly_pulses for delete
  using (
    auth.uid() = (
      select user_id from public.cycles where id = cycle_id
    )
  );

-- --------------------------------------------------------
-- daily_checkins
-- --------------------------------------------------------
create table if not exists public.daily_checkins (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  mood       smallint not null check (mood between 1 and 5),
  note       text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.daily_checkins enable row level security;

create policy "Users can select own checkins"
  on public.daily_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.daily_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.daily_checkins for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own checkins"
  on public.daily_checkins for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------
-- trigger: auto-create profile row on user signup
-- --------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
