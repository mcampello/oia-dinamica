import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Turma = {
  id: string;
  nome: string;
  codigo: string;
  ativa: boolean;
  marca: string;
  created_at: string;
};

export type Envio = {
  id: string;
  turma_id: string;
  grupo: number;
  candidato: string;
  motivo: string;
  dado: string;
  faltou: string;
  prompt: string;
  created_at: string;
};

let client: SupabaseClient | null = null;

// Service role: uso exclusivo no servidor. RLS está em deny-all para as
// chaves públicas, então nenhuma query funciona fora daqui.
export function db(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente");
    }
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
