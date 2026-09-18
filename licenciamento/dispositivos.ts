// licenciamento/dispositivos.ts
//
// Usado tanto por /api/licencas/ativar (GACFOOD ERP, computadores) quanto
// por /api/validacao (GACFOOD TRUCK, celulares) — o limite de dispositivos
// contratado por uma empresa (lic.empresas.limite_dispositivos) precisa
// valer pros dois tipos de aparelho igualmente, não só pra um deles.
import { supabase } from "../supabase/conexao.js";

/**
 * Confere se este dispositivo (hashDispositivo) já é conhecido para esta
 * licença. Se já é, só atualiza "visto por último" — reabrir o mesmo
 * computador ou celular nunca conta como um dispositivo novo, mesmo que
 * o app tenha perdido a configuração local e precise reativar. Se é um
 * dispositivo realmente novo, confere o limite contratado pela empresa
 * antes de liberar; se estourar o limite, lança erro e NADA é registrado.
 */
export async function verificarERegistrarDispositivo(
  licencaId: string,
  limiteDispositivos: number,
  hashDispositivo: string
): Promise<void> {
  const { data: existente, error: erroExistente } = await supabase
    .from("licencas_dispositivos")
    .select("id")
    .eq("licenca_id", licencaId)
    .eq("hash_dispositivo", hashDispositivo)
    .maybeSingle();

  if (erroExistente) throw erroExistente;

  if (existente) {
    await supabase
      .from("licencas_dispositivos")
      .update({ ultimo_acesso: new Date().toISOString() })
      .eq("id", (existente as any).id);
    return;
  }

  const { count, error: erroContagem } = await supabase
    .from("licencas_dispositivos")
    .select("id", { count: "exact", head: true })
    .eq("licenca_id", licencaId);

  if (erroContagem) throw erroContagem;

  if ((count ?? 0) >= limiteDispositivos) {
    throw new Error(
      `Limite de ${limiteDispositivos} dispositivo(s) já atingido para esta empresa. ` +
      `Para liberar este aparelho, é necessário aumentar o limite contratado ou remover um dispositivo antigo.`
    );
  }

  const { error: erroInsercao } = await supabase
    .from("licencas_dispositivos")
    .insert({ licenca_id: licencaId, hash_dispositivo: hashDispositivo });

  if (erroInsercao) throw erroInsercao;
}
