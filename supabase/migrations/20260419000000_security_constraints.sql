-- ============================================================
-- LifeBalance — security hardening: input length constraints
-- and email lock trigger to prevent desync with auth.users
-- ============================================================

-- --------------------------------------------------------
-- profiles: size limits on free-form and JSONB fields
-- --------------------------------------------------------
alter table public.profiles
  add constraint profiles_name_len
    check (name is null or char_length(name) <= 100),
  add constraint profiles_avatar_len
    check (avatar is null or char_length(avatar) <= 2000),
  add constraint profiles_prefs_size
    check (octet_length(preferences::text) <= 8192);

-- Prevent authenticated users from changing their own email column
-- (auth.users.email is the source of truth; keeping them in sync
-- via trigger is safer than relying on the client).
create or replace function public.lock_profile_email()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.email is distinct from new.email then
    new.email := old.email;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_lock_email on public.profiles;
create trigger profiles_lock_email
  before update on public.profiles
  for each row execute function public.lock_profile_email();

-- --------------------------------------------------------
-- cycles: notes and JSONB size limits
-- --------------------------------------------------------
alter table public.cycles
  add constraint cycles_label_len
    check (label is null or char_length(label) <= 200),
  add constraint cycles_notes_len
    check (notes is null or char_length(notes) <= 5000),
  add constraint cycles_scores_size
    check (octet_length(scores::text) <= 8192),
  add constraint cycles_scores_is_object
    check (jsonb_typeof(scores) = 'object');

-- --------------------------------------------------------
-- weekly_pulses: note and JSONB size limits
-- --------------------------------------------------------
alter table public.weekly_pulses
  add constraint weekly_pulses_note_len
    check (note is null or char_length(note) <= 1000),
  add constraint weekly_pulses_scores_size
    check (octet_length(scores::text) <= 8192),
  add constraint weekly_pulses_scores_is_object
    check (jsonb_typeof(scores) = 'object');

-- --------------------------------------------------------
-- daily_checkins: note size limit
-- --------------------------------------------------------
alter table public.daily_checkins
  add constraint daily_checkins_note_len
    check (note is null or char_length(note) <= 1000);
