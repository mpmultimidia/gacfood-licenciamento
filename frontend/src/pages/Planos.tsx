import { useEffect, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package
} from "lucide-react";

import Card from "../components/Card";

import api, {
    PlanoDTO
} from "../api/cliente";


export default function Planos() {


    const [planos,setPlanos] = useState<PlanoDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);



    async function carregarPlanos(){

        try{

            setCarregando(true);

            const resposta =
                await api.listarPlanos();


            setPlanos(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar planos",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarPlanos();

    },[]);



    const planosFiltrados =
        planos.filter((plano)=>{


            const termo =
                busca.toLowerCase();


            return (

                plano.nome
                    ?.toLowerCase()
                    .includes(termo)

            );


        });



    return (

        <div>


            <div

                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    marginBottom:25
                }}

            >

                <div>

                    <h2

                        style={{
                            fontSize:28,
                            fontWeight:700
                        }}

                    >

                        Planos

                    </h2>


                    <p

                        style={{
                            color:"#6b7280"
                        }}

                    >

                        Gerenciamento dos planos de licenciamento.

                    </p>


                </div>


                <button

                    style={{
                        display:"flex",
                        alignItems:"center",
                        gap:8,
                        background:"#2563eb",
                        color:"#ffffff",
                        border:"none",
                        borderRadius:8,
                        padding:"12px 18px",
                        fontWeight:600
                    }}

                >

                    <Plus size={18}/>

                    Novo plano

                </button>


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

                        placeholder="Pesquisar plano..."

                        value={busca}

                        onChange={(e)=>
                            setBusca(
                                e.target.value
                            )
                        }

                    />

                </div>



                {

                    carregando ?

                    (

                        <div

                            style={{
                                padding:40,
                                textAlign:"center"
                            }}

                        >

                            Carregando planos...

                        </div>

                    )

                    :

                    (

                    <table>


                        <thead>

                            <tr>

                                <th>
                                    Plano
                                </th>

                                <th>
                                    Valor
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Ações
                                </th>

                            </tr>

                        </thead>



                        <tbody>


                        {

                        planosFiltrados.length === 0

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

                                    Nenhum plano encontrado.

                                </td>

                            </tr>

                        )


                        :


                        planosFiltrados.map(plano=>(


                            <tr

                                key={plano.id}

                            >


                                <td>


                                    <div

                                        style={{
                                            display:"flex",
                                            alignItems:"center",
                                            gap:10
                                        }}

                                    >

                                        <Package
                                            size={18}
                                        />


                                        {plano.nome}


                                    </div>


                                </td>


                                <td>

                                    R$ {

                                        Number(
                                            plano.valor ?? 0
                                        )
                                        .toFixed(2)

                                    }

                                </td>


                                <td>

                                    <span

                                        style={{
                                            background:"#dcfce7",
                                            color:"#166534",
                                            padding:"5px 10px",
                                            borderRadius:20,
                                            fontSize:12
                                        }}

                                    >

                                        {plano.status ?? "Ativo"}

                                    </span>

                                </td>


                                <td>


                                    <div

                                        style={{
                                            display:"flex",
                                            gap:10
                                        }}

                                    >

                                        <button

                                            style={{
                                                border:"none",
                                                background:"#eff6ff",
                                                padding:8,
                                                borderRadius:6
                                            }}

                                        >

                                            <Pencil
                                                size={16}
                                                color="#2563eb"
                                            />

                                        </button>



                                        <button

                                            style={{
                                                border:"none",
                                                background:"#fef2f2",
                                                padding:8,
                                                borderRadius:6
                                            }}

                                        >

                                            <Trash2
                                                size={16}
                                                color="#dc2626"
                                            />

                                        </button>


                                    </div>


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