import { supabase } from "../supabase/conexao.js";

export async function registrarEventoSistema(
  mensagem: string,
  tipo: string = "INFO",
  usuario?: string | null
) {
  const { error } = await supabase
    .from("logs_sistema")
    .insert({
      tipo,
      mensagem,
      usuario: usuario ?? null,
    } as any);

  // Um log que falha nunca deve derrubar a ação principal — só avisa
  // no console do servidor.
  if (error) {
    console.error("Erro ao gravar log do sistema:", error.message);
  }
}

export async function listarLogsSistema() {
  const { data, error } = await supabase
    .from("logs_sistema")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(200);

  if (error) throw error;

  return data ?? [];
}
