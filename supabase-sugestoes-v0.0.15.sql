-- URIL CABO VERDE — SUGESTÕES PÚBLICAS E RESPOSTAS V0.0.15
-- Executar uma única vez no SQL Editor do Supabase num projecto já existente.

create extension if not exists pgcrypto;

create table if not exists public.uril_suggestions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  nick text not null check (char_length(nick) between 2 and 18),
  island text not null,
  body text not null check (char_length(body) between 4 and 1200),
  created_at timestamptz not null default now()
);

create index if not exists uril_suggestions_created_idx
  on public.uril_suggestions(created_at desc);

alter table public.uril_suggestions enable row level security;

drop policy if exists "suggestions_select_authenticated" on public.uril_suggestions;
create policy "suggestions_select_authenticated"
on public.uril_suggestions for select
to authenticated
using (true);

drop policy if exists "suggestions_insert_own" on public.uril_suggestions;
create policy "suggestions_insert_own"
on public.uril_suggestions for insert
to authenticated
with check (auth.uid() = author_id);

create table if not exists public.uril_suggestion_replies (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.uril_suggestions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  nick text not null check (char_length(nick) between 2 and 18),
  island text not null,
  body text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);

create index if not exists uril_suggestion_replies_parent_idx
  on public.uril_suggestion_replies(suggestion_id, created_at asc);

alter table public.uril_suggestion_replies enable row level security;

drop policy if exists "suggestion_replies_select_authenticated" on public.uril_suggestion_replies;
create policy "suggestion_replies_select_authenticated"
on public.uril_suggestion_replies for select
to authenticated
using (true);

drop policy if exists "suggestion_replies_insert_own" on public.uril_suggestion_replies;
create policy "suggestion_replies_insert_own"
on public.uril_suggestion_replies for insert
to authenticated
with check (auth.uid() = author_id);

grant select, insert on public.uril_suggestions to authenticated;
grant select, insert on public.uril_suggestion_replies to authenticated;

-- Actualização em tempo real para que novas sugestões e respostas apareçam sem recarregar a página.
do $$
begin
  alter publication supabase_realtime add table public.uril_suggestions;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.uril_suggestion_replies;
exception
  when duplicate_object then null;
end $$;
