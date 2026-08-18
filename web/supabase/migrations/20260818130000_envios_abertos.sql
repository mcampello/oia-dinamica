-- Separa o acesso à turma da janela em que resultados são aceitos.
alter table public.turmas
  add column if not exists envios_abertos boolean;

-- Preserva o comportamento anterior para turmas ativas e impede que turmas
-- já encerradas voltem a receber envios só por causa da migração.
update public.turmas
set envios_abertos = ativa
where envios_abertos is null;

alter table public.turmas
  alter column envios_abertos set default true,
  alter column envios_abertos set not null;
