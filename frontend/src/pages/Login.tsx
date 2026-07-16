import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    LockKeyhole
} from "lucide-react";

import {
    useAuth
} from "../contexts/AuthContext";

import cliente from "../api/cliente";

export default function Login() {

    const navigate =
        useNavigate();

    const {
        entrar
    } = useAuth();

    const [login, setLogin] =
        useState("");

    const [senha, setSenha] =
        useState("");

    const [carregando, setCarregando] =
        useState(false);

    const [erro, setErro] =
        useState("");

    async function autenticar(e: React.FormEvent) {

        e.preventDefault();

        setErro("");
        setCarregando(true);

        try {

            const resposta = await cliente.login(login, senha);

            if (!resposta.data.ok) {
                setErro(resposta.data.erro || "Login ou senha inválidos.");
                return;
            }

            entrar(resposta.data.usuario, resposta.data.token);

            navigate("/dashboard");

        } catch (err: any) {

            setErro(
                err.response?.data?.erro ||
                "Não foi possível conectar ao servidor. Tente novamente."
            );

        } finally {

            setCarregando(false);

        }

    }

    return (

        <div

            style={{

                minHeight: "100vh",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                background: "#f3f4f6"

            }}

        >

            <form

                onSubmit={autenticar}

                style={{

                    width: 380,

                    background: "#ffffff",

                    padding: 35,

                    borderRadius: 15,

                    boxShadow:
                        "0 10px 30px rgba(0,0,0,.08)"

                }}

            >

                <div

                    style={{

                        textAlign: "center",

                        marginBottom: 25

                    }}

                >

                    <LockKeyhole

                        size={45}

                        color="#2563eb"

                    />

                    <h2>

                        GACFOOD

                    </h2>

                    <p>

                        Acesso administrativo

                    </p>

                </div>

                {erro && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 15,
                            fontSize: 14,
                        }}
                    >
                        {erro}
                    </div>
                )}

                <input

                    placeholder="Login"

                    value={login}

                    onChange={(e) =>
                        setLogin(
                            e.target.value
                        )
                    }

                    style={{

                        width: "100%",

                        padding: 12,

                        marginBottom: 15

                    }}

                />

                <input

                    type="password"

                    placeholder="Senha"

                    value={senha}

                    onChange={(e) =>
                        setSenha(
                            e.target.value
                        )
                    }

                    style={{

                        width: "100%",

                        padding: 12,

                        marginBottom: 20

                    }}

                />

                <button

                    disabled={carregando}

                    style={{

                        width: "100%",

                        padding: 12,

                        background: "#2563eb",

                        color: "#fff",

                        border: "none",

                        borderRadius: 8,

                        fontWeight: 600,

                        opacity: carregando ? 0.7 : 1,

                    }}

                >

                    {carregando ? "Entrando..." : "Entrar"}

                </button>

            </form>

        </div>

    );

}
