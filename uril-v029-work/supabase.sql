-- URIL DE CABO VERDE — BANCOS DE URIL ONLINE V0
-- Executar uma única vez no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.uril_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 40),
  host_id uuid not null references auth.users(id) on delete cascade,
  host_nick text not null check (char_length(host_nick) between 2 and 18),
  host_island text not null,
  guest_id uuid references auth.users(id) on delete set null,
  guest_nick text,
  guest_island text,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  allow_spectators boolean not null default true,
  game_state jsonb not null,
  version bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists uril_rooms_status_updated_idx
  on public.uril_rooms(status, updated_at desc);

alter table public.uril_rooms enable row level security;

-- Todos os visitantes com sessão anónima conseguem ver as bancos abertos.
drop policy if exists "rooms_select_authenticated" on public.uril_rooms;
create policy "rooms_select_authenticated"
on public.uril_rooms for select
to authenticated
using (true);

-- Cada visitante cria apenas bancos em seu próprio nome técnico.
drop policy if exists "rooms_insert_host" on public.uril_rooms;
create policy "rooms_insert_host"
on public.uril_rooms for insert
to authenticated
with check (auth.uid() = host_id);

-- O anfitrião e o convidado actualizam o jogo. Um banco ainda vazia aceita
-- a entrada de um convidado, desde que o novo guest_id seja o próprio utilizador.
drop policy if exists "rooms_update_players_or_join" on public.uril_rooms;
create policy "rooms_update_players_or_join"
on public.uril_rooms for update
to authenticated
using (
  auth.uid() = host_id
  or auth.uid() = guest_id
  or guest_id is null
)
with check (
  auth.uid() = host_id
  or auth.uid() = guest_id
);

-- Apenas o anfitrião elimina definitivamente um banco.
drop policy if exists "rooms_delete_host" on public.uril_rooms;
create policy "rooms_delete_host"
on public.uril_rooms for delete
to authenticated
using (auth.uid() = host_id);

-- Activa notificações em tempo real para a lista de bancos e para as partidas.
do $$
begin
  alter publication supabase_realtime add table public.uril_rooms;
exception
  when duplicate_object then null;
end $$;

-- Limpeza manual opcional de bancos antigos:
-- delete from public.uril_rooms where updated_at < now() - interval '24 hours';

-- ---------------------------------------------------------------------------
-- SUGESTÕES PÚBLICAS E RESPOSTAS — acrescentado na v0.0.15
-- ---------------------------------------------------------------------------

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
