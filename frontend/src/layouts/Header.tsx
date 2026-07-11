import { Bell, UserCircle } from "lucide-react";

import { useLocation } from "react-router-dom";

const titulos: Record<string, string> = {

    "/dashboard": "Dashboard",

    "/empresas": "Empresas",

    "/usuarios": "Usuários",

    "/planos": "Planos",

    "/licencas": "Licenças",

    "/modulos": "Módulos",

    "/configuracoes": "Configurações",

    "/logs": "Logs do Sistema",

    "/historico": "Histórico",

    "/saude": "Saúde do Sistema"

};

export default function Header() {

    const location = useLocation();

    const titulo = titulos[location.pathname] ?? "GACFOOD";

    return (

        <header
            style={{
                height: 72,
                background: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px"
            }}
        >

            <div>

                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        margin: 0,
                        color: "#111827"
                    }}
                >

                    {titulo}

                </h1>

                <span
                    style={{
                        fontSize: 13,
                        color: "#6b7280"
                    }}
                >

                    Painel administrativo de licenciamento

                </span>

            </div>


            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18
                }}
            >

                <button

                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#374151"
                    }}

                >

                    <Bell size={21}/>

                </button>


                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}
                >

                    <UserCircle
                        size={38}
                        color="#2563eb"
                    />

                    <div>

                        <div
                            style={{
                                fontWeight:600,
                                fontSize:14
                            }}
                        >

                            Administrador

                        </div>

                        <div
                            style={{
                                fontSize:12,
                                color:"#6b7280"
                            }}
                        >

                            Sistema

                        </div>

                    </div>

                </div>


            </div>

        </header>

    );

}