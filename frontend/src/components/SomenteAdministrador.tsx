import {
    Navigate,
    Outlet
} from "react-router-dom";


import {
    useAuth
} from "../contexts/AuthContext";



// Usa dentro de <ProtectedRoute/> — bloqueia usuários secundários (tela
// de Usuários) de páginas restritas ao MASTER/administrador, como o
// Dashboard (mostra receita e dados financeiros do negócio).
export default function SomenteAdministrador(){


    const {
        usuario
    } = useAuth();


    if(usuario?.tipo !== "administrador"){

        return (

            <Navigate

                to="/empresas"

                replace

            />

        );

    }


    return (

        <Outlet />

    );


}
