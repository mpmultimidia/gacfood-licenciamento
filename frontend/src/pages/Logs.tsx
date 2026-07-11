import { useEffect, useState } from "react";

import {
    Search,
    FileText,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

import Card from "../components/Card";

import api from "../api/cliente";


interface LogSistema {

    id?: string;

    tipo?: string;

    mensagem?: string;

    usuario?: string;

    criado_em?: string;

}



export default function Logs() {


    const [logs,setLogs] =
        useState<LogSistema[]>([]);


    const [busca,setBusca] =
        useState("");


    const [carregando,setCarregando] =
        useState(false);



    async function carregarLogs(){

        try{

            setCarregando(true);


            const resposta =
                await api.listarLogs();


            setLogs(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar logs",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarLogs();

    },[]);



    const logsFiltrados =
        logs.filter((log)=>{


            const termo =
                busca.toLowerCase();


            return (

                log.mensagem
                    ?.toLowerCase()
                    .includes(termo)

                ||

                log.tipo
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

                    <FileText/>

                    Logs do Sistema

                </h2>


                <p

                    style={{
                        color:"#6b7280"
                    }}

                >

                    Histórico de atividades realizadas no sistema.

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

                        placeholder="Pesquisar log..."

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

                        Carregando logs...

                    </div>

                )


                :


                (

                <table>


                    <thead>

                        <tr>

                            <th>

                                Tipo

                            </th>


                            <th>

                                Mensagem

                            </th>


                            <th>

                                Usuário

                            </th>


                            <th>

                                Data

                            </th>


                        </tr>


                    </thead>


                    <tbody>


                    {

                    logsFiltrados.length === 0

                    ?

                    (

                        <tr>

                            <td

                                colSpan={4}

                                style={{
                                    textAlign:"center",
                                    padding:40
                                }}

                            >

                                Nenhum registro encontrado.

                            </td>

                        </tr>

                    )


                    :


                    logsFiltrados.map((log)=>(


                        <tr

                            key={log.id}

                        >


                            <td>


                                {

                                log.tipo === "ERRO"

                                ?

                                (

                                    <AlertCircle

                                        size={18}

                                        color="#dc2626"

                                    />

                                )

                                :

                                (

                                    <CheckCircle2

                                        size={18}

                                        color="#16a34a"

                                    />

                                )

                                }


                            </td>


                            <td>

                                {log.mensagem ?? "-"}

                            </td>


                            <td>

                                {log.usuario ?? "-"}

                            </td>


                            <td>

                                {log.criado_em ?? "-"}

                            </td>


                        </tr>


                    ))

                    }


                    </tbody>


                </table>

                )


                }


            </Card>


        </div>

    );

}