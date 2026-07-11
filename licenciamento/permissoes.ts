import { supabase } from "../supabase/conexao.ts";
import {
  buscarLicencaAtivaDaEmpresa,
  licencaEstaValida
} from "./validacao.ts";


export interface Permissao {

  modulo: string;

  visualizar: boolean;

  criar: boolean;

  editar: boolean;

  excluir: boolean;

}



export interface FuncionalidadeLiberada {

  codigo: string;

  nome: string;

}



export function criarPermissao(
  modulo: string
): Permissao {

  return {

    modulo,

    visualizar: true,

    criar: false,

    editar: false,

    excluir: false

  };

}



export async function listarFuncionalidadesDoPlano(
  planoId: string
): Promise<FuncionalidadeLiberada[]> {


  const { data, error } = await supabase
    .from("plano_funcionalidades")
    .select(`
      habilitado,
      funcionalidades (
        codigo,
        nome,
        ativo
      )
    `)
    .eq("plano_id", planoId)
    .eq("habilitado", true);



  if (error) {

    throw error;

  }



  return (data ?? [])
    .filter((linha: any) =>
      linha.funcionalidades?.ativo
    )
    .map((linha: any) => ({

      codigo:
        linha.funcionalidades.codigo,

      nome:
        linha.funcionalidades.nome

    }));

}



export async function listarFuncionalidadesDaEmpresa(
  empresaId: string
): Promise<FuncionalidadeLiberada[]> {


  const licenca =
    await buscarLicencaAtivaDaEmpresa(
      empresaId
    );


  if (!licencaEstaValida(licenca)) {

    return [];

  }


  return listarFuncionalidadesDoPlano(
    licenca.plano_id
  );

}



export async function empresaTemFuncionalidade(
  empresaId: string,
  codigoFuncionalidade: string
): Promise<boolean> {


  const funcionalidades =
    await listarFuncionalidadesDaEmpresa(
      empresaId
    );


  return funcionalidades.some(
    (f) =>
      f.codigo === codigoFuncionalidade
  );

}