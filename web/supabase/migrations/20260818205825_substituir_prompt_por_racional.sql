-- O campo deixa de guardar o texto inicial enviado ao modelo e passa a
-- registrar como o grupo ponderou evidências, tensões e condições.
alter table public.envios rename column prompt to racional;

-- Remove a assinatura anterior caso a migração atômica já tenha sido
-- aplicada em outro ambiente antes desta migração.
drop function if exists public.registrar_envio(
  uuid,
  smallint,
  text,
  text,
  text,
  text,
  text
);

create function public.registrar_envio(
  p_turma_id uuid,
  p_grupo smallint,
  p_candidato text,
  p_motivo text,
  p_dado text,
  p_faltou text,
  p_racional text
)
returns table (
  status text,
  envio_id uuid,
  enviado_em timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_ativa boolean;
  v_envios_abertos boolean;
begin
  select turma.ativa, turma.envios_abertos
    into v_ativa, v_envios_abertos
  from public.turmas as turma
  where turma.id = p_turma_id
  for update;

  if not found or not v_ativa then
    return query select 'encerrada'::text, null::uuid, null::timestamptz;
    return;
  end if;

  if not v_envios_abertos then
    return query select 'fechados'::text, null::uuid, null::timestamptz;
    return;
  end if;

  return query
    insert into public.envios as envio (
      turma_id,
      grupo,
      candidato,
      motivo,
      dado,
      faltou,
      racional
    )
    values (
      p_turma_id,
      p_grupo,
      p_candidato,
      p_motivo,
      p_dado,
      p_faltou,
      p_racional
    )
    returning 'sucesso'::text, envio.id, envio.created_at;
end;
$$;

revoke execute on function public.registrar_envio(uuid, smallint, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.registrar_envio(uuid, smallint, text, text, text, text, text)
  to service_role;

notify pgrst, 'reload schema';
