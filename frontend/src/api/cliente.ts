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
    empresaCodigo: string | null;
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

export interface ModuloDTO {
    id: string;
    nome: string;
    descricao: string | null;
    status?: string;
}

export interface NovoPlanoDTO {
    nome: string;
    descricao?: string;
    valor?: number;
    ativo?: boolean;
    limite_dispositivos_padrao?: number;
    dias_validade_padrao?: number;
    funcionalidades?: string[];
}

export interface UsuarioDTO {
    id: string;
    nome: string;
    login: string;
    perfil: string;
    ativo: boolean;
    criado_em: string;
}

export interface NovoUsuarioDTO {
    nome: string;
    login: string;
    senha: string;
    perfil?: string;
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



    atualizarEmpresa(id: string, dados: Partial<NovaEmpresaDTO> & { status?: string }){

        return api.put(
            `/empresas/${id}`,
            dados
        );

    },



    excluirEmpresa(id: string){

        return api.delete(
            `/empresas/${id}`
        );

    },



    listarUsuarios(){

        return api.get(
            "/usuarios"
        );

    },



    criarUsuario(dados: NovoUsuarioDTO){

        return api.post(
            "/usuarios",
            dados
        );

    },



    atualizarUsuario(id: string, dados: Partial<NovoUsuarioDTO> & {ativo?: boolean}){

        return api.put(
            `/usuarios/${id}`,
            dados
        );

    },



    excluirUsuario(id: string){

        return api.delete(
            `/usuarios/${id}`
        );

    },



    listarPlanos(){

        return api.get(
            "/planos"
        );

    },



    criarPlano(dados: NovoPlanoDTO){

        return api.post(
            "/planos",
            dados
        );

    },



    buscarPlano(id: string){

        return api.get(
            `/planos/${id}`
        );

    },



    atualizarPlano(id: string, dados: Partial<NovoPlanoDTO>){

        return api.put(
            `/planos/${id}`,
            dados
        );

    },



    excluirPlano(id: string){

        return api.delete(
            `/planos/${id}`
        );

    },



    listarLicencas(){

        return api.get(
            "/licencas"
        );

    },



    dashboard(periodo?: {inicio?:string; fim?:string}){

        return api.get(
            "/dashboard",
            { params: periodo }
        );

    },



    licencasVencendo(){

        return api.get(
            "/licencas/vencendo"
        );

    },



    atualizarLicenca(id: string, dados: { status?: string; plano_id?: string; expira_em?: string }){

        return api.put(
            `/licencas/${id}`,
            dados
        );

    },



    excluirLicenca(id: string){

        return api.delete(
            `/licencas/${id}`
        );

    },



    criarLicenca(dados: NovaLicencaDTO){

        return api.post(
            "/licencas",
            dados
        );

    },



    solicitarCodigoAtivacao(codigoEmpresa: string){

        return api.post(
            "/licencas/solicitar-codigo",
            { codigoEmpresa }
        );

    },



    listarModulos(){

        return api.get(
            "/modulos"
        );

    },



    criarModulo(dados: {nome:string; descricao?:string; status?:string}){

        return api.post(
            "/modulos",
            dados
        );

    },



    atualizarModulo(id: string, dados: {nome?:string; descricao?:string; status?:string}){

        return api.put(
            `/modulos/${id}`,
            dados
        );

    },



    excluirModulo(id: string){

        return api.delete(
            `/modulos/${id}`
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
