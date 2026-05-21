alter table public.person_profiles
add column if not exists jungian_functions jsonb not null default '[]'::jsonb,
add column if not exists closeness_score integer not null default 3 check (closeness_score between 1 and 5);
