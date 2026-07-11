import { useEffect, useState } from "react";

import {
    Puzzle,
    Search,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";

import Card from "../components/Card";

import api from "../api/cliente";


interface Modulo {

    id?: string;

    nome: string;

    descricao?: string;

    status?: string;

}



export default function Modulos() {


    const [modulos,setModulos] =
        useState<Modulo[]>([]);


    const [busca,setBusca] =
        useState("");


    const [carregando,setCarregando] =
        useState(false);



    async function carregarModulos(){

        try{

            setCarregando(true);


            const resposta =
                await api.listarModulos();


            setModulos(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar módulos",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarModulos();

    },[]);



    const modulosFiltrados =
        modulos.filter((modulo)=>{


            return modulo.nome
                ?.toLowerCase()
                .includes(
                    busca.toLowerCase()
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

                        Módulos

                    </h2>


                    <p

                        style={{
                            color:"#6b7280"
                        }}

                    >

                        Recursos disponíveis no sistema.

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

                    Novo módulo

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

                        placeholder="Pesquisar módulo..."

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
                            textAlign:"center",
                            padding:40
                        }}

                    >

                        Carregando módulos...

                    </div>

                )


                :

                (

                <table>


                    <thead>

                        <tr>

                            <th>

                                Módulo

                            </th>


                            <th>

                                Descrição

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

                    modulosFiltrados.length === 0

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

                                Nenhum módulo encontrado.

                            </td>

                        </tr>

                    )


                    :


                    modulosFiltrados.map((modulo)=>(


                        <tr

                            key={modulo.id}

                        >


                            <td>


                                <div

                                    style={{
                                        display:"flex",
                                        alignItems:"center",
                                        gap:10
                                    }}

                                >

                                    <Puzzle
                                        size={18}
                                    />

                                    {modulo.nome}

                                </div>


                            </td>


                            <td>

                                {modulo.descricao ?? "-"}

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

                                    {modulo.status ?? "Ativo"}

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