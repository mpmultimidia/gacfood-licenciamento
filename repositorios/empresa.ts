import { supabase } from "../supabase/conexao";

export class EmpresaRepositorio {

  async listar() {
    return await supabase
      .from("empresas")
      .select("*");
  }

  async buscarPorId(id: string) {
    return await supabase
      .from("empresas")
      .select("*")
      .eq("id", id)
      .single();
  }

  async criar(dados: unknown) {
    return await supabase
      .from("empresas")
      .insert(dados)
      .select()
      .single();
  }
}