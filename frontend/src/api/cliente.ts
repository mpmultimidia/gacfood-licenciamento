import axios from "axios";

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
            "/historico"
        );

    },



    saude(){

        return api.get(
            "/saude"
        );

    }



};



export default cliente;
