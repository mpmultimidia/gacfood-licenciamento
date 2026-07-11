import { supabase } from "../supabase/conexao.ts";

export async function verificarSaudeBanco() {
  const inicio = Date.now();

  try {
    const { error } = await supabase
      .from("empresas")
      .select("id")
      .limit(1);

    const tempoResposta = `${Date.now() - inicio}ms`;

    if (error) {
      return {
        banco: "erro",
        tempoResposta,
        erro: error.message,
      };
    }

    return {
      banco: "online",
      tempoResposta,
      erro: null,
    };
  } catch (erro) {
    return {
      banco: "erro",
      tempoResposta: `${Date.now() - inicio}ms`,
      erro:
        erro instanceof Error
          ? erro.message
          : "Erro desconhecido",
    };
  }
}