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

    const [modalAberto,setModalAberto] = useState(false);

    const [salvando,setSalvando] = useState(false);

    const [erroForm,setErroForm] = useState("");

    const [moduloEditando,setModuloEditando] = useState<Modulo | null>(null);

    const [excluindo,setExcluindo] = useState<string | null>(null);

    const formVazio = { nome: "", descricao: "", status: "ATIVO" };

    const [form,setForm] = useState(formVazio);



    function abrirModal(modulo?: Modulo){

        if(modulo){

            setModuloEditando(modulo);

            setForm({
                nome: modulo.nome,
                descricao: modulo.descricao ?? "",
                status: modulo.status ?? "ATIVO"
            });

        }else{

            setModuloEditando(null);
            setForm(formVazio);

        }

        setErroForm("");
        setModalAberto(true);

    }



    function fecharModal(){

        if(salvando) return;

        setModalAberto(false);

    }



    async function salvarModulo(){

        if(!form.nome.trim()){

            setErroForm("Informe o nome do módulo.");

            return;

        }

        try{

            setSalvando(true);
            setErroForm("");

            if(moduloEditando){

                await api.atualizarModulo(
                    moduloEditando.id!,
                    form
                );

            }else{

                await api.criarModulo(form);

            }

            setModalAberto(false);

            await carregarModulos();

        }catch(erro: any){

            console.error("Erro ao salvar módulo", erro);

            setErroForm(
                erro?.response?.data?.erro
                ??
                "Não foi possível salvar o módulo."
            );

        }finally{

            setSalvando(false);

        }

    }



    async function excluirModulo(modulo: Modulo){

        const confirmou = window.confirm(
            `Desativar o módulo "${modulo.nome}"?`
        );

        if(!confirmou) return;

        try{

            setExcluindo(modulo.id!);

            await api.excluirModulo(modulo.id!);

            await carregarModulos();

        }catch(erro){

            console.error("Erro ao excluir módulo", erro);

            alert("Não foi possível excluir o módulo.");

        }finally{

            setExcluindo(null);

        }

    }



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

                    onClick={()=> abrirModal()}

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
                                        background: modulo.status === "ATIVO" ? "#dcfce7" : "#fef2f2",
                                        color: modulo.status === "ATIVO" ? "#166534" : "#dc2626",
                                        padding:"5px 10px",
                                        borderRadius:20,
                                        fontSize:12
                                    }}

                                >

                                    {modulo.status ?? "ATIVO"}

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

                                        onClick={()=> abrirModal(modulo)}

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

                                        onClick={()=> excluirModulo(modulo)}

                                        disabled={excluindo === modulo.id}

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


            {

            modalAberto &&

            (

                <div

                    onClick={fecharModal}

                    style={{
                        position:"fixed",
                        inset:0,
                        background:"rgba(0,0,0,.45)",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        zIndex:50
                    }}

                >

                    <div

                        onClick={(e)=>e.stopPropagation()}

                        style={{
                            background:"#ffffff",
                            borderRadius:14,
                            padding:26,
                            width:420,
                            maxWidth:"92vw"
                        }}

                    >

                        <h3

                            style={{
                                fontSize:20,
                                fontWeight:700,
                                marginBottom:18
                            }}

                        >

                            {moduloEditando ? "Editar módulo" : "Novo módulo"}

                        </h3>


                        {

                        erroForm &&

                        (

                            <div

                                style={{
                                    background:"#fef2f2",
                                    color:"#dc2626",
                                    padding:"10px 14px",
                                    borderRadius:8,
                                    marginBottom:16,
                                    fontSize:14
                                }}

                            >

                                {erroForm}

                            </div>

                        )

                        }


                        <div style={{display:"flex", flexDirection:"column", gap:12}}>

                            <label>

                                Nome do módulo *

                                <input

                                    value={form.nome}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            nome: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                Descrição

                                <textarea

                                    value={form.descricao}

                                    rows={3}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            descricao: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                Status

                                <select

                                    value={form.status}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            status: e.target.value
                                        })
                                    }

                                >

                                    <option value="ATIVO">Ativo</option>
                                    <option value="INATIVO">Inativo</option>

                                </select>

                            </label>

                        </div>


                        <div

                            style={{
                                display:"flex",
                                justifyContent:"flex-end",
                                gap:10,
                                marginTop:22
                            }}

                        >

                            <button

                                onClick={fecharModal}

                                disabled={salvando}

                                style={{
                                    border:"1px solid #e5e7eb",
                                    background:"#ffffff",
                                    padding:"10px 18px",
                                    borderRadius:8,
                                    fontWeight:600
                                }}

                            >

                                Cancelar

                            </button>


                            <button

                                onClick={salvarModulo}

                                disabled={salvando}

                                style={{
                                    border:"none",
                                    background:"#2563eb",
                                    color:"#ffffff",
                                    padding:"10px 18px",
                                    borderRadius:8,
                                    fontWeight:600
                                }}

                            >

                                {salvando ? "Salvando..." : (moduloEditando ? "Salvar alterações" : "Criar módulo")}

                            </button>

                        </div>

                    </div>

                </div>

            )

            }


        </div>

    );

}