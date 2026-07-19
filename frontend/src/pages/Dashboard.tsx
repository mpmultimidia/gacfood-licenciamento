import { useEffect, useState } from "react";

import {
    Building2,
    KeyRound,
    Users,
    PackageCheck,
    AlertTriangle,
    Server,
    Database,
    Activity,
    DollarSign
} from "lucide-react";

import Card from "../components/Card";
import api from "../api/cliente";

interface VencendoItem {
    codigo_licenca: string;
    expira_em: string;
    empresa: { codigo: string; nome_fantasia: string } | null;
}

interface ReceitaPorPlano {
    plano_id: string;
    plano_nome: string;
    valor_unitario: number;
    quantidade_licencas: number;
    total: number;
}

export default function Dashboard() {

    const [contadores,setContadores] = useState({
        empresas: 0,
        licencas: 0,
        usuarios: 0,
        planos: 0
    });

    const [receitaPorPlano,setReceitaPorPlano] = useState<ReceitaPorPlano[]>([]);

    const [receitaTotal,setReceitaTotal] = useState(0);

    const [vencendo,setVencendo] = useState<VencendoItem[]>([]);

    const [carregando,setCarregando] = useState(true);

    const [erroConexao,setErroConexao] = useState(false);



    useEffect(()=>{

        async function carregar(){

            try{

                setCarregando(true);

                const [respostaDashboard, respostaVencendo] = await Promise.all([
                    api.dashboard(),
                    api.licencasVencendo()
                ]);

                setContadores(
                    respostaDashboard.data?.dados ?? {
                        empresas: 0,
                        licencas: 0,
                        usuarios: 0,
                        planos: 0
                    }
                );

                setReceitaPorPlano(
                    respostaDashboard.data?.dados?.receitaPorPlano ?? []
                );

                setReceitaTotal(
                    respostaDashboard.data?.dados?.receitaTotal ?? 0
                );

                setVencendo(
                    respostaVencendo.data?.licencas ?? []
                );

                setErroConexao(false);

            }catch(erro){

                console.error("Erro ao carregar dashboard", erro);

                setErroConexao(true);

            }finally{

                setCarregando(false);

            }

        }

        carregar();

    },[]);


    const metricas = [

        {
            titulo: "Receita mensal (licenças ativas)",
            valor:
                "R$ " +
                receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            icone: DollarSign,
            cor: "#16a34a"
        },

        {
            titulo: "Empresas cadastradas",
            valor: String(contadores.empresas),
            icone: Building2,
            cor: "#2563eb"
        },

        {
            titulo: "Licenças emitidas",
            valor: String(contadores.licencas),
            icone: KeyRound,
            cor: "#16a34a"
        },

        {
            titulo: "Usuários",
            valor: String(contadores.usuarios),
            icone: Users,
            cor: "#9333ea"
        },

        {
            titulo: "Planos",
            valor: String(contadores.planos),
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

                                            {carregando ? "..." : item.valor}

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

                        valor={erroConexao ? "Offline / com erro" : "Online"}

                        cor={erroConexao ? "#dc2626" : "#16a34a"}

                    />


                    <StatusItem

                        icone={<Database size={20}/>}

                        titulo="Banco de dados"

                        valor={erroConexao ? "Sem resposta" : "Conectado"}

                        cor={erroConexao ? "#dc2626" : "#16a34a"}

                    />


                    <StatusItem

                        icone={<Activity size={20}/>}

                        titulo="Sistema"

                        valor="Online"

                        cor="#16a34a"

                    />


                </Card>



                <Card

                    titulo="Alertas — licenças vencendo em breve"

                >

                    {

                    vencendo.length === 0

                    ?

                    (

                        <div
                            style={{
                                display:"flex",
                                gap:12,
                                alignItems:"center",
                                padding:15,
                                background:"#f0fdf4",
                                borderRadius:10
                            }}
                        >

                            <AlertTriangle
                                color="#16a34a"
                            />

                            <span>

                                Nenhuma licença vencendo encontrada.

                            </span>

                        </div>

                    )

                    :

                    (

                        <div style={{display:"flex", flexDirection:"column", gap:10}}>

                        {

                        vencendo.map((item)=>(

                            <div

                                key={item.codigo_licenca}

                                style={{
                                    display:"flex",
                                    gap:12,
                                    alignItems:"center",
                                    padding:12,
                                    background:"#fff7ed",
                                    borderRadius:10
                                }}

                            >

                                <AlertTriangle
                                    color="#ea580c"
                                    size={18}
                                />

                                <span style={{fontSize:14}}>

                                    <b>{item.empresa?.nome_fantasia ?? "Empresa"}</b> — vence em {new Date(item.expira_em).toLocaleDateString('pt-BR')}

                                </span>

                            </div>

                        ))

                        }

                        </div>

                    )

                    }


                </Card>


            </div>


            <div style={{ marginTop:25 }}>

                <Card

                    titulo="Receita por plano (licenças ativas)"

                >

                    {

                    receitaPorPlano.length === 0

                    ?

                    (

                        <div
                            style={{
                                padding:15,
                                color:"#6b7280",
                                fontSize:14
                            }}
                        >

                            Nenhuma licença ativa ainda.

                        </div>

                    )

                    :

                    (

                        <table style={{ width:"100%", borderCollapse:"collapse" }}>

                            <thead>

                                <tr>

                                    <th style={{ textAlign:"left", padding:"10px 8px", fontSize:13, color:"#6b7280", borderBottom:"1px solid #e5e7eb" }}>
                                        Plano
                                    </th>

                                    <th style={{ textAlign:"right", padding:"10px 8px", fontSize:13, color:"#6b7280", borderBottom:"1px solid #e5e7eb" }}>
                                        Valor unitário
                                    </th>

                                    <th style={{ textAlign:"right", padding:"10px 8px", fontSize:13, color:"#6b7280", borderBottom:"1px solid #e5e7eb" }}>
                                        Licenças ativas
                                    </th>

                                    <th style={{ textAlign:"right", padding:"10px 8px", fontSize:13, color:"#6b7280", borderBottom:"1px solid #e5e7eb" }}>
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                receitaPorPlano.map((linha)=>(

                                    <tr key={linha.plano_id}>

                                        <td style={{ padding:"10px 8px", borderBottom:"1px solid #f3f4f6", fontWeight:600 }}>
                                            {linha.plano_nome}
                                        </td>

                                        <td style={{ padding:"10px 8px", borderBottom:"1px solid #f3f4f6", textAlign:"right", color:"#6b7280" }}>
                                            R$ {linha.valor_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>

                                        <td style={{ padding:"10px 8px", borderBottom:"1px solid #f3f4f6", textAlign:"right" }}>
                                            {linha.quantidade_licencas}
                                        </td>

                                        <td style={{ padding:"10px 8px", borderBottom:"1px solid #f3f4f6", textAlign:"right", fontWeight:700, color:"#16a34a" }}>
                                            R$ {linha.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>

                                    </tr>

                                ))

                                }


                                <tr>

                                    <td colSpan={3} style={{ padding:"12px 8px", fontWeight:700 }}>
                                        Total geral
                                    </td>

                                    <td style={{ padding:"12px 8px", textAlign:"right", fontWeight:700, color:"#16a34a", fontSize:16 }}>
                                        R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    )

                    }

                </Card>

            </div>


        </div>

    );

}


function StatusItem({

    icone,

    titulo,

    valor,

    cor

}:{

    icone:React.ReactNode;

    titulo:string;

    valor:string;

    cor?:string;

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
                        color: cor ?? "#6b7280"
                    }}
                >

                    {valor}

                </div>

            </div>


        </div>

    );

}
