import { useEffect, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    KeyRound
} from "lucide-react";

import Card from "../components/Card";

import api, {
    LicencaDTO
} from "../api/cliente";


export default function Licencas() {


    const [licencas,setLicencas] = useState<LicencaDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);



    async function carregarLicencas(){

        try{

            setCarregando(true);

            const resposta =
                await api.listarLicencas();


            setLicencas(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar licenças",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarLicencas();

    },[]);



    const licencasFiltradas =
        licencas.filter((licenca)=>{


            const termo =
                busca.toLowerCase();


            return (

                String(licenca.empresaId ?? "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(licenca.planoId ?? "")
                    .toLowerCase()
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

                        Licenças

                    </h2>


                    <p

                        style={{
                            color:"#6b7280"
                        }}

                    >

                        Controle das licenças emitidas pelo sistema.

                    </p>


                </div>


                <button

                    style={{
                        display:"flex",
                        alignItems:"center",
                        gap:8,
                        background:"#2563eb",
                        color:"#fff",
                        border:"none",
                        borderRadius:8,
                        padding:"12px 18px",
                        fontWeight:600
                    }}

                >

                    <Plus size={18}/>

                    Nova licença

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

                        placeholder="Pesquisar licença..."

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
                                textAlign:"center",
                                padding:40
                            }}

                        >

                            Carregando licenças...

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
                                    Plano
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

                        licencasFiltradas.length === 0

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

                                    Nenhuma licença encontrada.

                                </td>

                            </tr>

                        )


                        :


                        licencasFiltradas.map((licenca)=>(


                            <tr

                                key={licenca.id}

                            >


                                <td>


                                    <div

                                        style={{
                                            display:"flex",
                                            alignItems:"center",
                                            gap:10
                                        }}

                                    >

                                        <KeyRound
                                            size={18}
                                        />


                                        {licenca.empresaId ?? "-"}


                                    </div>


                                </td>


                                <td>

                                    {licenca.planoId ?? "-"}

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

                                        Ativa

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