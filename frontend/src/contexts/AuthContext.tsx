import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";

interface Usuario {
    id: string;
    login: string;
    nome: string | null;
    perfil?: string;
    tipo?: "administrador" | "usuario";
}

interface AuthContexto {
    usuario: Usuario | null;
    autenticado: boolean;
    entrar: (usuario: Usuario, token: string) => void;
    sair: () => void;
}

const AuthContext =
    createContext<AuthContexto | null>(null);

export function AuthProvider({
    children
}: {
    children: ReactNode;
}) {

    const [usuario, setUsuario] =
        useState<Usuario | null>(null);

    useEffect(() => {

        const salvo =
            localStorage.getItem("gac_usuario");

        if (salvo) {
            // O objeto salvo tem { ...usuario, token } — o interceptor de
            // api/cliente.ts" lê o "token" direto daqui.
            setUsuario(JSON.parse(salvo));
        }

    }, []);

    function entrar(usuario: Usuario, token: string) {

        const dados = { ...usuario, token };

        localStorage.setItem(
            "gac_usuario",
            JSON.stringify(dados)
        );

        setUsuario(usuario);

    }

    function sair() {

        localStorage.removeItem("gac_usuario");

        setUsuario(null);

    }

    return (

        <AuthContext.Provider

            value={{
                usuario,
                autenticado: !!usuario,
                entrar,
                sair
            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const contexto =
        useContext(AuthContext);

    if (!contexto) {
        throw new Error(
            "useAuth deve ser usado dentro do AuthProvider"
        );
    }

    return contexto;

}
