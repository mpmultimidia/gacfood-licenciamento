import { supabase } from "../supabase/conexao.js";


export interface Plano {

    id?: string;

    nome: string;

    descricao?: string;

    valor?: number;

    ativo?: boolean;

    limite_dispositivos_padrao?: number;

    dias_validade_padrao?: number;

    criado_em?: string;

    atualizado_em?: string;

}



export class ServicoPlano {


    async listar(): Promise<Plano[]> {

        const { data, error } = await supabase
            .from("planos")
            .select("*")
            .order("nome");


        if (error) {
            throw new Error(`Erro ao listar planos: ${error.message}`);
        }


        return data ?? [];

    }



    async buscarPorId(id: string): Promise<Plano | null> {

        const { data, error } = await supabase
            .from("planos")
            .select("*")
            .eq("id", id)
            .single();


        if (error) {

            if (error.code === "PGRST116") {
                return null;
            }

            throw new Error(`Erro ao buscar plano: ${error.message}`);

        }


        return data;

    }



    async criar(plano: Plano): Promise<Plano> {

        const { data, error } = await supabase
            .from("planos")
            .insert(plano)
            .select()
            .single();


        if (error) {
            throw new Error(`Erro ao criar plano: ${error.message}`);
        }


        return data;

    }



    async atualizar(
        id: string,
        plano: Partial<Plano>
    ): Promise<Plano> {

        const { data, error } = await supabase
            .from("planos")
            .update({
                ...plano,
                atualizado_em: new Date().toISOString()
            })
            .eq("id", id)
            .select()
            .single();


        if (error) {
            throw new Error(`Erro ao atualizar plano: ${error.message}`);
        }


        return data;

    }



    async excluir(id: string): Promise<void> {

        const { error } = await supabase
            .from("planos")
            .delete()
            .eq("id", id);


        if (error) {
            throw new Error(`Erro ao excluir plano: ${error.message}`);
        }

    }

}



export const planoService = new ServicoPlano();



/*
  Compatibilidade com api/rotas/planos.ts
*/


export async function listarPlanos() {

    return planoService.listar();

}



export async function buscarPlano(
    id: string
) {

    return planoService.buscarPorId(id);

}



export async function criarPlano(
    plano: Plano
) {

    return planoService.criar(plano);

}



export async function atualizarPlano(
    id: string,
    plano: Partial<Plano>
) {

    return planoService.atualizar(id, plano);

}



export async function excluirPlano(
    id: string
) {

    return planoService.excluir(id);

}



/**
 * Devolve os IDs das funcionalidades (módulos) já habilitadas para
 * um plano — usado para pré-marcar os checkboxes na tela de edição.
 */
export async function listarFuncionalidadesDoPlano(
    planoId: string
): Promise<string[]> {

    const { data, error } = await supabase
        .from("plano_funcionalidades")
        .select("funcionalidade_id")
        .eq("plano_id", planoId)
        .eq("habilitado", true);

    if (error) {
        throw new Error(`Erro ao listar módulos do plano: ${error.message}`);
    }

    return (data ?? []).map((linha: any) => linha.funcionalidade_id);

}



/**
 * Substitui por completo o conjunto de módulos habilitados para um
 * plano — apaga as associações antigas e grava as novas de uma vez.
 */
export async function definirFuncionalidadesDoPlano(
    planoId: string,
    funcionalidadeIds: string[]
): Promise<void> {

    const { error: erroExcluir } = await supabase
        .from("plano_funcionalidades")
        .delete()
        .eq("plano_id", planoId);

    if (erroExcluir) {
        throw new Error(`Erro ao atualizar módulos do plano: ${erroExcluir.message}`);
    }

    if (funcionalidadeIds.length === 0) {
        return;
    }

    const linhas = funcionalidadeIds.map((funcionalidadeId) => ({
        plano_id: planoId,
        funcionalidade_id: funcionalidadeId,
        habilitado: true,
    }));

    const { error: erroInserir } = await supabase
        .from("plano_funcionalidades")
        .insert(linhas as any);

    if (erroInserir) {
        throw new Error(`Erro ao atualizar módulos do plano: ${erroInserir.message}`);
    }

}