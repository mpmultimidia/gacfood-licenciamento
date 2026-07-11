import { useEffect, useState } from "react";

import {
    Plus,
    Search,
    Pencil,
    Trash2,
    UserRound
} from "lucide-react";

import Card from "../components/Card";

import api, {
    UsuarioDTO
} from "../api/cliente";


export default function Usuarios() {


    const [usuarios,setUsuarios] = useState<UsuarioDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);



    async function carregarUsuarios(){

        try{

            setCarregando(true);

            const resposta =
                await api.listarUsuarios();


            setUsuarios(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar usuários",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarUsuarios();

    },[]);



    const usuariosFiltrados =
        usuarios.filter((usuario)=>{


            const termo =
                busca.toLowerCase();


            return (

                usuario.nome
                    ?.toLowerCase()
                    .includes(termo)

                ||

                usuario.email
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

                        Usuários

                    </h2>


                    <p

                        style={{
                            color:"#6b7280"
                        }}

                    >

                        Controle de usuários e permissões.

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

                    Novo usuário

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

                        placeholder="Pesquisar usuário..."

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

                            Carregando usuários...

                        </div>

                    )


                    :

                    (

                    <table>


                        <thead>

                            <tr>

                                <th>
                                    Usuário
                                </th>

                                <th>
                                    E-mail
                                </th>

                                <th>
                                    Ações
                                </th>

                            </tr>

                        </thead>



                        <tbody>


                        {

                        usuariosFiltrados.length === 0

                        ?

                        (

                            <tr>

                                <td

                                    colSpan={3}

                                    style={{
                                        textAlign:"center",
                                        padding:40
                                    }}

                                >

                                    Nenhum usuário encontrado.

                                </td>

                            </tr>

                        )


                        :


                        usuariosFiltrados.map(usuario=>(


                            <tr

                                key={usuario.id}

                            >


                                <td>


                                    <div

                                        style={{
                                            display:"flex",
                                            alignItems:"center",
                                            gap:10
                                        }}

                                    >

                                        <UserRound
                                            size={18}
                                        />

                                        {usuario.nome}

                                    </div>


                                </td>


                                <td>

                                    {usuario.email}

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