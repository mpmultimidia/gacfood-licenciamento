import {
    Navigate
} from "react-router-dom";


import {
    useAuth
} from "../contexts/AuthContext";



// Substitui o antigo redirecionamento fixo pra /dashboard" — usuários
// secundários não têm acesso ao Dashboard, então caem em /empresas.
export default function RedirecionamentoInicial(){


    const {
        usuario
    } = useAuth();


    const destino =
        usuario?.tipo === "administrador"
            ? "/dashboard"
            : "/empresas";


    return (

        <Navigate

            to={destino}

            replace

        />

    );


}
