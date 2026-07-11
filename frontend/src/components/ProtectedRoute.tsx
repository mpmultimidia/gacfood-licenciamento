import {
    Navigate,
    Outlet
} from "react-router-dom";


import {
    useAuth
} from "../contexts/AuthContext";



export default function ProtectedRoute(){


    const {
        autenticado
    } = useAuth();



    if(!autenticado){

        return (

            <Navigate

                to="/login"

                replace

            />

        );

    }



    return (

        <Outlet />

    );


}