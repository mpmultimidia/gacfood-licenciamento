// supabase/authRestaurante.ts
//
// Ponte entre o sistema de LICENCIAMENTO (schema "lic", onde vive a tabela
// `empresas`) e o sistema GACFOOD em si (schema "public", onde vive a tabela
// `restaurantes` e o Row Level Security que isola os dados de cada cliente).

import { supabase } from "./conexao.js";
import crypto from "crypto";

export interface CredenciaisRestaurante {
  supabase_url: string;
  supabase_anon_key: string;
  supabase_auth_email: string;
  supabase_auth_senha: string | null;
}

function gerarSenhaForte(): string {
  return crypto.randomBytes(18).toString("base64url");
}

function emailInternoParaCodigo(codigoLicenca: string): string {
  const slug = codigoLicenca
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug}@auth.gacfood.internal`;
}

/**
 * Garante que existe um restaurante (schema public, isolado por RLS) e um
 * usuário do Supabase Auth vinculado a ele, para o código de licença
 * informado. Idempotente — pode ser chamada quantas vezes for preciso.
 *
 * @param gerarNovaSenha - true na primeira ativação, ou sempre que for
 *   necessário reenviar/reemitir as credenciais pro cliente (a senha
 *   antiga deixa de funcionar quando uma nova é gerada).
 */
export async function garantirCredenciaisRestaurante(params: {
  nomeEmpresa: string;
  codigoLicenca: string;
  gerarNovaSenha: boolean;
}): Promise<CredenciaisRestaurante> {
  const { nomeEmpresa, codigoLicenca, gerarNovaSenha } = params;

  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_ANON_KEY não configuradas no .env do servidor de licenciamento."
    );
  }

  // O cliente `supabase` de conexao.ts" está fixado no schema "lic".
  // A tabela `restaurantes` vive no schema "public" — usamos .schema()
  // para apontar essa consulta especificamente para lá.
  const publicDb = supabase.schema("public" as any);

  let { data: restaurante, error: erroBusca } = await (publicDb as any)
    .from("restaurantes")
    .select("*")
    .eq("codigo_licenca", codigoLicenca)
    .maybeSingle();

  if (erroBusca) throw erroBusca;

  if (!restaurante) {
    const { data: novo, error: erroCriar } = await (publicDb as any)
      .from("restaurantes")
      .insert({ nome: nomeEmpresa, codigo_licenca: codigoLicenca, ativo: true })
      .select()
      .single();

    if (erroCriar) throw erroCriar;
    restaurante = novo;
  }

  const email = emailInternoParaCodigo(codigoLicenca);
  let authUserId: string | null = restaurante.auth_user_id;
  let senha: string | null = null;

  if (!authUserId) {
    senha = gerarSenhaForte();

    const { data: usuarioCriado, error: erroAuth } =
      await supabase.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        app_metadata: { restaurante_id: restaurante.id },
      });

    if (erroAuth) {
      const jaExiste = /already registered|already exists/i.test(erroAuth.message);
      if (!jaExiste) throw erroAuth;

      const { data: lista, error: erroLista } = await supabase.auth.admin.listUsers();
      if (erroLista) throw erroLista;

      const existente = lista.users.find((u) => u.email === email);
      if (!existente) throw erroAuth;

      authUserId = existente.id;

      await supabase.auth.admin.updateUserById(authUserId, {
        password: senha,
        app_metadata: { restaurante_id: restaurante.id },
      });
    } else {
      authUserId = usuarioCriado.user.id;
    }

    const { error: erroVincular } = await (publicDb as any)
      .from("restaurantes")
      .update({ auth_user_id: authUserId })
      .eq("id", restaurante.id);

    if (erroVincular) throw erroVincular;

  } else if (gerarNovaSenha) {
    senha = gerarSenhaForte();

    const { error: erroSenha } = await supabase.auth.admin.updateUserById(
      authUserId,
      { password: senha, app_metadata: { restaurante_id: restaurante.id } }
    );

    if (erroSenha) throw erroSenha;
  }

  return {
    supabase_url: supabaseUrl,
    supabase_anon_key: supabaseAnonKey,
    supabase_auth_email: email,
    supabase_auth_senha: senha,
  };
}
