import axios from "axios";

export interface EmpresaDTO {
    id: string;
    codigo: string;
    razao_social: string;
    nome_fantasia: string;
    cnpj: string | null;
    telefone: string | null;
    whatsapp: string;
    email: string | null;
    cidade: string | null;
    uf: string | null;
    status: string;
    observacoes: string | null;
    plano_id: string | null;
    limite_dispositivos: number | null;
    criado_em: string;
}

export interface NovaEmpresaDTO {
    razao_social: string;
    nome_fantasia: string;
    whatsapp: string;
    cnpj?: string;
    telefone?: string;
    email?: string;
    cidade?: string;
    uf?: string;
    observacoes?: string;
    plano_id?: string;
    limite_dispositivos?: number;
}

export interface LicencaDTO {
    id: string;
    empresaId: string;
    planoId: string;
    empresa: string;
    plano: string;
    codigo_licenca: string;
    versao: string;
    status: string;
    emitida_em: string;
    expira_em: string;
}

export interface NovaLicencaDTO {
    empresa_id: string;
    plano_id: string;
    dias_validade?: number;
}

export interface PlanoDTO {
    id: string;
    nome: string;
    descricao: string | null;
    valor: number;
    ativo: boolean;
}

const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL
        ||
        "http://localhost:3000/api",

    headers: {

        "Content-Type":
            "application/json"

    }

});


api.interceptors.request.use(

    (config)=>{


        const usuario =
            localStorage.getItem(
                "gac_usuario"
            );


        if(usuario){

            const dados =
                JSON.parse(usuario);


            if(dados.token){

                config.headers.Authorization =
                    `Bearer ${dados.token}`;

            }

        }


        return config;


    },


    (erro)=>{

        return Promise.reject(erro);

    }

);




const cliente = {

    login(login: string, senha: string) {

        return api.post(
            "/auth/login",
            { login, senha }
        );

    },



    listarEmpresas(){

        return api.get(
            "/empresas"
        );

    },



    criarEmpresa(dados: NovaEmpresaDTO){

        return api.post(
            "/empresas",
            dados
        );

    },



    listarUsuarios(){

        return api.get(
            "/usuarios"
        );

    },



    listarPlanos(){

        return api.get(
            "/planos"
        );

    },



    listarLicencas(){

        return api.get(
            "/licencas"
        );

    },



    criarLicenca(dados: NovaLicencaDTO){

        return api.post(
            "/licencas",
            dados
        );

    },



    listarModulos(){

        return api.get(
            "/modulos"
        );

    },



    listarConfiguracoes(){

        return api.get(
            "/configuracoes"
        );

    },



    salvarConfiguracoes(
        dados:any
    ){

        return api.put(

            "/configuracoes",

            dados

        );

    },



    listarLogs(){

        return api.get(
            "/logs"
        );

    },



    listarHistorico(){

        return api.get(
            "/licencas/historico"
        );

    },



    saude(){

        return api.get(
            "/saude"
        );

    }



};



export default cliente;
