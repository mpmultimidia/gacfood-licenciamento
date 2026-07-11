import api from "../api/cliente";


export const LicenciamentoService = {


    validarLicenca(){

        return api.listarLicencas();

    },


    listarEmpresas(){

        return api.listarEmpresas();

    },


    listarPlanos(){

        return api.listarPlanos();

    },


    listarModulos(){

        return api.listarModulos();

    },


    obterSaude(){

        return api.saude();

    }


};