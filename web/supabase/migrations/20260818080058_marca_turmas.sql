alter table public.turmas
  add column if not exists marca text not null default 'pandora';
