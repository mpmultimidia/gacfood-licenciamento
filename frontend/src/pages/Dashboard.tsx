import {
    Building2,
    KeyRound,
    Users,
    PackageCheck,
    AlertTriangle,
    Server,
    Database,
    Activity
} from "lucide-react";

import Card from "../components/Card";

export default function Dashboard() {

    const metricas = [

        {
            titulo: "Empresas cadastradas",
            valor: "0",
            icone: Building2,
            cor: "#2563eb"
        },

        {
            titulo: "Licenças ativas",
            valor: "0",
            icone: KeyRound,
            cor: "#16a34a"
        },

        {
            titulo: "Usuários",
            valor: "0",
            icone: Users,
            cor: "#9333ea"
        },

        {
            titulo: "Planos",
            valor: "0",
            icone: PackageCheck,
            cor: "#ea580c"
        }

    ];


    return (

        <div>

            <div
                style={{
                    marginBottom:25
                }}
            >

                <h2
                    style={{
                        fontSize:28,
                        fontWeight:700
                    }}
                >

                    Visão geral

                </h2>

                <p
                    style={{
                        color:"#6b7280",
                        marginTop:5
                    }}
                >

                    Acompanhe o status do sistema de licenciamento.

                </p>

            </div>


            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:
                    "repeat(auto-fit,minmax(230px,1fr))",
                    gap:20
                }}
            >

                {

                    metricas.map((item)=>{

                        const Icone=item.icone;

                        return(

                            <Card
                                key={item.titulo}
                            >

                                <div
                                    style={{
                                        display:"flex",
                                        justifyContent:"space-between",
                                        alignItems:"center"
                                    }}
                                >

                                    <div>

                                        <div
                                            style={{
                                                color:"#6b7280",
                                                fontSize:14
                                            }}
                                        >

                                            {item.titulo}

                                        </div>


                                        <div
                                            style={{
                                                fontSize:34,
                                                fontWeight:700,
                                                marginTop:10
                                            }}
                                        >

                                            {item.valor}

                                        </div>


                                    </div>


                                    <Icone
                                        size={38}
                                        color={item.cor}
                                    />


                                </div>

                            </Card>

                        );

                    })

                }

            </div>



            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:
                    "repeat(auto-fit,minmax(320px,1fr))",
                    gap:20,
                    marginTop:25
                }}
            >

                <Card
                    titulo="Status da aplicação"
                >

                    <StatusItem

                        icone={<Server size={20}/>}

                        titulo="API"

                        valor="Aguardando conexão"

                    />


                    <StatusItem

                        icone={<Database size={20}/>}

                        titulo="Banco de dados"

                        valor="Aguardando conexão"

                    />


                    <StatusItem

                        icone={<Activity size={20}/>}

                        titulo="Sistema"

                        valor="Online"

                    />


                </Card>



                <Card

                    titulo="Alertas"

                >

                    <div
                        style={{
                            display:"flex",
                            gap:12,
                            alignItems:"center",
                            padding:15,
                            background:"#fff7ed",
                            borderRadius:10
                        }}
                    >

                        <AlertTriangle
                            color="#ea580c"
                        />

                        <span>

                            Nenhuma licença vencendo encontrada.

                        </span>

                    </div>


                </Card>


            </div>


        </div>

    );

}


function StatusItem({

    icone,

    titulo,

    valor

}:{

    icone:React.ReactNode;

    titulo:string;

    valor:string;

}){


    return(

        <div
            style={{
                display:"flex",
                alignItems:"center",
                gap:15,
                padding:"14px 0",
                borderBottom:"1px solid #e5e7eb"
            }}
        >

            {icone}

            <div>

                <div
                    style={{
                        fontWeight:600
                    }}
                >

                    {titulo}

                </div>

                <div
                    style={{
                        fontSize:13,
                        color:"#6b7280"
                    }}
                >

                    {valor}

                </div>

            </div>


        </div>

    );

}