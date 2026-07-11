import { useEffect, useState } from "react";

import {
    Building2,
    Plus,
    Search,
    Pencil,
    Trash2
} from "lucide-react";

import Card from "../components/Card";

import api, {
    EmpresaDTO
} from "../api/cliente";


export default function Empresas() {


    const [empresas,setEmpresas] = useState<EmpresaDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);



    async function carregarEmpresas(){

        try{

            setCarregando(true);

            const resposta = await api.listarEmpresas();

            setEmpresas(
                resposta.data ?? []
            );

        }catch(erro){

            console.error(
                "Erro ao carregar empresas",
                erro
            );

        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarEmpresas();

    },[]);



    const empresasFiltradas =
        empresas.filter((empresa)=>{

            const termo =
                busca.toLowerCase();


            return (

                empresa.nome
                    ?.toLowerCase()
                    .includes(termo)

                ||

                empresa.documento
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

                        Empresas

                    </h2>


                    <p

                        style={{
                            color:"#6b7280"
                        }}

                    >

                        Gerenciamento das empresas licenciadas.

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

                    Nova empresa

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

                        placeholder="Pesquisar empresa..."

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

                            Carregando empresas...

                        </div>

                    )

                    :

                    (

                    <table>


                        <thead>

                            <tr>

                                <th>

                                    Empresa

                                </th>

                                <th>

                                    Documento

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

                        empresasFiltradas.length === 0

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

                                    Nenhuma empresa encontrada.

                                </td>

                            </tr>

                        )

                        :

                        empresasFiltradas.map((empresa)=>(

                            <tr key={empresa.id}>


                                <td>

                                    <div

                                        style={{
                                            display:"flex",
                                            alignItems:"center",
                                            gap:10
                                        }}

                                    >

                                        <Building2
                                            size={18}
                                        />

                                        {empresa.nome}

                                    </div>

                                </td>


                                <td>

                                    {empresa.documento}

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

                                        {empresa.status ?? "Ativa"}

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