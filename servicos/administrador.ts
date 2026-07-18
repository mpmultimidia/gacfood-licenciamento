// servicos/administrador.ts
import bcrypt from "bcryptjs";
import { supabase } from "../supabase/conexao.js";

export interface Administrador {
  id: string;
  login: string;
  nome: string | null;
  perfil: string;
}

/**
 * Valida login e senha contra lic.administradores". Substitui a antiga
 * validação por e-mail via Supabase Auth — este painel nunca deve pedir
 * e-mail, só login e senha, como todo o resto do sistema GACFOOD.
 */
export async function autenticarAdministrador(
  login: string,
  senha: string
): Promise<Administrador | null> {
  console.log(`[auth-diagnostico] Tentativa de login recebida. login="${login}" (tamanho da senha: ${senha?.length ?? 0})`);

  const { data, error } = await supabase
    .from("administradores")
    .select("id, login, senha_hash, nome, ativo")
    .eq("login", login)
    .eq("ativo", true)
    .maybeSingle();

  if (error) {
    console.log(`[auth-diagnostico] Erro na consulta ao banco:`, JSON.stringify(error));
    return null;
  }

  if (!data) {
    console.log(`[auth-diagnostico] Nenhuma linha encontrada para login="${login}".`);
    return null;
  }

  console.log(`[auth-diagnostico] Linha encontrada. id=${(data as any).id}, hash começa com: ${(data as any).senha_hash?.slice(0, 7)}`);

  const senhaCorreta = bcrypt.compareSync(senha, (data as any).senha_hash);

  console.log(`[auth-diagnostico] Resultado da comparação de senha: ${senhaCorreta}`);

  if (!senhaCorreta) {
    return null;
  }

  return {
    id: (data as any).id,
    login: (data as any).login,
    nome: (data as any).nome,
    perfil: "admin",
  };
}
