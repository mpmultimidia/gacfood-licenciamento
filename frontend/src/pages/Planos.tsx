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
    PlanoDTO,
    NovoPlanoDTO,
    ModuloDTO
} from "../api/cliente";


export default function Planos() {


    const [planos,setPlanos] = useState<PlanoDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);

    const [modalAberto,setModalAberto] = useState(false);

    const [salvando,setSalvando] = useState(false);

    const [erroForm,setErroForm] = useState("");

    const [planoEditando,setPlanoEditando] = useState<PlanoDTO | null>(null);

    const [excluindo,setExcluindo] = useState<string | null>(null);

    const [modulos,setModulos] = useState<ModuloDTO[]>([]);

    const formVazio: NovoPlanoDTO = {
        nome: "",
        descricao: "",
        valor: 0,
        ativo: true,
        limite_dispositivos_padrao: 1,
        funcionalidades: []
    };

    const [form,setForm] = useState<NovoPlanoDTO>(formVazio);



    async function abrirModal(plano?: PlanoDTO){

        setErroForm("");
        setModalAberto(true);

        try{

            const respostaModulos = await api.listarModulos();
            setModulos(respostaModulos.data ?? []);

        }catch(erro){

            console.error("Erro ao carregar módulos", erro);

        }

        if(plano){

            setPlanoEditando(plano);

            try{

                const respostaPlano = await api.buscarPlano(plano.id);

                setForm({
                    nome: respostaPlano.data.nome,
                    descricao: respostaPlano.data.descricao ?? "",
                    valor: respostaPlano.data.valor ?? 0,
                    ativo: respostaPlano.data.ativo,
                    limite_dispositivos_padrao: respostaPlano.data.limite_dispositivos_padrao ?? 1,
                    funcionalidades: respostaPlano.data.funcionalidades ?? []
                });

            }catch(erro){

                console.error("Erro ao carregar plano", erro);

            }

        }else{

            setPlanoEditando(null);
            setForm(formVazio);

        }

    }



    function alternarModulo(id: string){

        const atual = form.funcionalidades ?? [];

        const novo = atual.includes(id)
            ? atual.filter((m)=> m !== id)
            : [...atual, id];

        setForm({ ...form, funcionalidades: novo });

    }



    function fecharModal(){

        if(salvando) return;

        setModalAberto(false);

    }



    async function salvarPlano(){

        if(!form.nome.trim()){

            setErroForm("Informe o nome do plano.");

            return;

        }

        try{

            setSalvando(true);
            setErroForm("");

            if(planoEditando){

                await api.atualizarPlano(
                    planoEditando.id,
                    form
                );

            }else{

                await api.criarPlano(form);

            }

            setModalAberto(false);

            await carregarPlanos();

        }catch(erro: any){

            console.error(
                "Erro ao salvar plano",
                erro
            );

            setErroForm(
                erro?.response?.data?.erro
                ??
                "Não foi possível salvar o plano. Tente novamente."
            );

        }finally{

            setSalvando(false);

        }

    }



    async function excluirPlano(plano: PlanoDTO){

        const confirmou = window.confirm(
            `Excluir o plano "${plano.nome}"? Só é possível excluir planos que não estejam em uso por nenhuma empresa/licença.`
        );

        if(!confirmou) return;

        try{

            setExcluindo(plano.id);

            await api.excluirPlano(plano.id);

            await carregarPlanos();

        }catch(erro: any){

            console.error(
                "Erro ao excluir plano",
                erro
            );

            alert(
                erro?.response?.data?.erro
                ??
                "Não foi possível excluir o plano (talvez esteja em uso)."
            );

        }finally{

            setExcluindo(null);

        }

    }



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
                                            background: plano.ativo ? "#dcfce7" : "#fef2f2",
                                            color: plano.ativo ? "#166534" : "#dc2626",
                                            padding:"5px 10px",
                                            borderRadius:20,
                                            fontSize:12
                                        }}

                                    >

                                        {plano.ativo ? "Ativo" : "Inativo"}

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

                                            onClick={()=> abrirModal(plano)}

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

                                            onClick={()=> excluirPlano(plano)}

                                            disabled={excluindo === plano.id}

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

                            {planoEditando ? "Editar plano" : "Novo plano"}

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

                                Nome do plano *

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

                                Valor (R$)

                                <input

                                    type="number"

                                    min={0}

                                    step="0.01"

                                    value={form.valor}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            valor: Number(e.target.value)
                                        })
                                    }

                                />

                            </label>


                            <label

                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    gap:8,
                                    flexDirection:"row"
                                }}

                            >

                                <input

                                    type="checkbox"

                                    checked={form.ativo}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            ativo: e.target.checked
                                        })
                                    }

                                />

                                Plano ativo

                            </label>


                            <label>

                                Quantas licenças (dispositivos) esse plano permite *

                                <input

                                    type="number"

                                    min={1}

                                    value={form.limite_dispositivos_padrao}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            limite_dispositivos_padrao: Number(e.target.value)
                                        })
                                    }

                                />

                            </label>


                            <div>

                                <div style={{marginBottom:8, fontWeight:600, fontSize:14}}>

                                    Módulos incluídos neste plano

                                </div>


                                {

                                modulos.length === 0

                                ?

                                (

                                    <div style={{fontSize:13, color:"#9ca3af"}}>

                                        Nenhum módulo cadastrado ainda.

                                    </div>

                                )

                                :

                                (

                                    <div

                                        style={{
                                            display:"flex",
                                            flexDirection:"column",
                                            gap:8,
                                            maxHeight:180,
                                            overflowY:"auto",
                                            border:"1px solid #e5e7eb",
                                            borderRadius:8,
                                            padding:12
                                        }}

                                    >

                                        {

                                        modulos.map((modulo)=>(

                                            <label

                                                key={modulo.id}

                                                style={{
                                                    display:"flex",
                                                    alignItems:"center",
                                                    gap:8,
                                                    flexDirection:"row",
                                                    fontWeight:400
                                                }}

                                            >

                                                <input

                                                    type="checkbox"

                                                    checked={
                                                        (form.funcionalidades ?? []).includes(modulo.id)
                                                    }

                                                    onChange={()=> alternarModulo(modulo.id)}

                                                />

                                                {modulo.nome}

                                            </label>

                                        ))

                                        }

                                    </div>

                                )

                                }

                            </div>

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

                                onClick={salvarPlano}

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

                                {salvando ? "Salvando..." : (planoEditando ? "Salvar alterações" : "Criar plano")}

                            </button>

                        </div>

                    </div>

                </div>

            )

            }


        </div>

    );

}