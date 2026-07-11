import { supabase } from "../supabase/conexao.ts";

export async function resumoSistema() {
  const [
    empresas,
    usuarios,
    licencas,
    planos
  ] = await Promise.all([
    supabase.from("empresas").select("id"),
    supabase.from("usuarios").select("id"),
    supabase.from("licencas").select("id"),
    supabase.from("planos").select("id")
  ]);

  return {
    empresas: empresas.data?.length || 0,
    usuarios: usuarios.data?.length || 0,
    licencas: licencas.data?.length || 0,
    planos: planos.data?.length || 0
  };
}