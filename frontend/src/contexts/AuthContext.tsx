import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";


interface Usuario {

    id:string;

    nome:string;

    email:string;

    perfil?:string;

}



interface AuthContexto {

    usuario:Usuario|null;

    autenticado:boolean;

    entrar:(usuario:Usuario)=>void;

    sair:()=>void;

}



const AuthContext =
    createContext<AuthContexto|null>(null);



export function AuthProvider({

    children

}:{

    children:ReactNode;

}){


    const [usuario,setUsuario] =
        useState<Usuario|null>(null);



    useEffect(()=>{


        const salvo =
            localStorage.getItem(
                "gac_usuario"
            );


        if(salvo){

            setUsuario(
                JSON.parse(salvo)
            );

        }


    },[]);




    function entrar(usuario:Usuario){


        localStorage.setItem(

            "gac_usuario",

            JSON.stringify(usuario)

        );


        setUsuario(usuario);


    }




    function sair(){


        localStorage.removeItem(
            "gac_usuario"
        );


        setUsuario(null);


    }




    return (

        <AuthContext.Provider

            value={{

                usuario,

                autenticado:
                    !!usuario,

                entrar,

                sair

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}



export function useAuth(){


    const contexto =
        useContext(AuthContext);



    if(!contexto){

        throw new Error(
            "useAuth deve ser usado dentro do AuthProvider"
        );

    }


    return contexto;


}