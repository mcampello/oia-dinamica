-- Serializa o envio com alterações no estado da turma. O bloqueio da linha
-- garante que fechar os envios e registrar um resultado tenham uma ordem
-- inequívoca, sem uma janela entre a validação e o insert.
create or replace function public.registrar_envio(
  p_turma_id uuid,
  p_grupo smallint,
  p_candidato text,
  p_motivo text,
  p_dado text,
  p_faltou text,
  p_prompt text
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
    insert into public.envios (
      turma_id,
      grupo,
      candidato,
      motivo,
      dado,
      faltou,
      prompt
    )
    values (
      p_turma_id,
      p_grupo,
      p_candidato,
      p_motivo,
      p_dado,
      p_faltou,
      p_prompt
    )
    returning 'sucesso'::text, envios.id, envios.created_at;
end;
$$;

-- Funções no schema public recebem EXECUTE de PUBLIC por padrão. Esta RPC é
-- interna ao servidor Next.js e só pode ser chamada com a service role.
revoke execute on function public.registrar_envio(uuid, smallint, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.registrar_envio(uuid, smallint, text, text, text, text, text)
  to service_role;
