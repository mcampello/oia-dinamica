-- Dinâmica OIA — turmas com código de acesso e envios de resultado.
-- Acesso ao banco só pelo servidor Next.js (service role); RLS ligado sem
-- policies deixa anon/authenticated sem nenhum acesso.

create table if not exists turmas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  codigo text not null unique,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists envios (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references turmas(id) on delete cascade,
  grupo smallint not null check (grupo between 1 and 4),
  candidato text not null check (candidato in ('rafael', 'aline', 'juliana', 'nenhum')),
  motivo text not null,
  dado text not null,
  faltou text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);

create index if not exists envios_turma_idx on envios (turma_id, created_at desc);

alter table turmas enable row level security;
alter table envios enable row level security;
