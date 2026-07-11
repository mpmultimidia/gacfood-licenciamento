export interface Empresa {

    id?: string;

    nome: string;

    documento: string;

    status?: string;

    criado_em?: string;

}



export interface Usuario {

    id?: string;

    nome: string;

    email: string;

    ativo?: boolean;

}



export interface Plano {

    id?: string;

    nome: string;

    valor: number;

    status?: string;

}



export interface Licenca {

    id?: string;

    empresa_id?: string;

    plano_id?: string;

    validade?: string;

    status?: string;

}



export interface Modulo {

    id?: string;

    nome: string;

    descricao?: string;

    ativo?: boolean;

}



export interface UsuarioLogado {

    id: string;

    nome: string;

    email: string;

    perfil?: string;

}



export interface RespostaAPI<T>{

    sucesso:boolean;

    dados:T;

    mensagem?:string;

}