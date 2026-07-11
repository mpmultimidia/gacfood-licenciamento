import { useEffect, useState } from "react";

import {
    History,
    Search,
    Clock3
} from "lucide-react";

import Card from "../components/Card";

import api from "../api/cliente";


interface RegistroHistorico {

    id?: string;

    acao?: string;

    descricao?: string;

    usuario?: string;

    data?: string;

}



export default function Historico() {


    const [historico,setHistorico] =
        useState<RegistroHistorico[]>([]);


    const [busca,setBusca] =
        useState("");


    const [carregando,setCarregando] =
        useState(false);



    async function carregarHistorico(){

        try{

            setCarregando(true);


            const resposta =
                await api.listarHistorico();


            setHistorico(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar histórico",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarHistorico();

    },[]);



    const registrosFiltrados =
        historico.filter((item)=>{


            const termo =
                busca.toLowerCase();


            return (

                item.acao
                    ?.toLowerCase()
                    .includes(termo)

                ||

                item.descricao
                    ?.toLowerCase()
                    .includes(termo)

            );


        });



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
                        fontWeight:700,
                        display:"flex",
                        alignItems:"center",
                        gap:10
                    }}

                >

                    <History/>

                    Histórico

                </h2>


                <p

                    style={{
                        color:"#6b7280"
                    }}

                >

                    Linha do tempo das operações do sistema.

                </p>


            </div>




            <Card>


                <div

                    style={{
                        display:"flex",
                        alignItems:"center",
                        gap:12,
                        marginBottom:20
                    }}

                >

                    <Search
                        size={20}
                        color="#6b7280"
                    />


                    <input

                        placeholder="Pesquisar histórico..."

                        value={busca}

                        onChange={(e)=>
                            setBusca(
                                e.target.value
                            )
                        }

                    />

                </div>




                {

                carregando

                ?

                (

                    <div

                        style={{
                            padding:40,
                            textAlign:"center"
                        }}

                    >

                        Carregando histórico...

                    </div>

                )


                :

                (

                    registrosFiltrados.length === 0

                    ?

                    (

                        <div

                            style={{
                                textAlign:"center",
                                padding:40,
                                color:"#6b7280"
                            }}

                        >

                            Nenhum evento registrado.

                        </div>

                    )


                    :

                    (

                    <div

                        style={{
                            display:"flex",
                            flexDirection:"column",
                            gap:15
                        }}

                    >

                    {

                    registrosFiltrados.map((item)=>(


                        <div

                            key={item.id}

                            style={{
                                display:"flex",
                                gap:15,
                                padding:16,
                                border:"1px solid #e5e7eb",
                                borderRadius:10
                            }}

                        >

                            <Clock3
                                size={20}
                                color="#2563eb"
                            />


                            <div>


                                <div

                                    style={{
                                        fontWeight:600
                                    }}

                                >

                                    {item.acao ?? "Evento"}

                                </div>


                                <div

                                    style={{
                                        marginTop:4,
                                        color:"#6b7280"
                                    }}

                                >

                                    {item.descricao ?? "-"}

                                </div>


                                <div

                                    style={{
                                        marginTop:8,
                                        fontSize:12,
                                        color:"#9ca3af"
                                    }}

                                >

                                    {item.usuario ?? "Sistema"}

                                    {" • "}

                                    {item.data ?? "-"}

                                </div>


                            </div>


                        </div>


                    ))

                    }


                    </div>

                    )

                )


                }


            </Card>


        </div>

    );

}