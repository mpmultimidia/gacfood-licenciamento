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
    EmpresaDTO,
    NovaEmpresaDTO
} from "../api/cliente";


export default function Empresas() {


    const [empresas,setEmpresas] = useState<EmpresaDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);

    const [modalAberto,setModalAberto] = useState(false);

    const [salvando,setSalvando] = useState(false);

    const [erroForm,setErroForm] = useState("");

    const formVazio: NovaEmpresaDTO = {
        razao_social: "",
        nome_fantasia: "",
        whatsapp: "",
        cnpj: "",
        telefone: "",
        email: "",
        cidade: "",
        uf: "",
        observacoes: ""
    };

    const [form,setForm] = useState<NovaEmpresaDTO>(formVazio);



    async function carregarEmpresas(){

        try{

            setCarregando(true);

            const resposta = await api.listarEmpresas();

            setEmpresas(
                resposta.data.empresas ?? []
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



    function abrirModal(){

        setForm(formVazio);
        setErroForm("");
        setModalAberto(true);

    }



    function fecharModal(){

        if(salvando) return;

        setModalAberto(false);

    }



    async function salvarEmpresa(){

        if(
            !form.razao_social.trim()
            ||
            !form.nome_fantasia.trim()
            ||
            !form.whatsapp.trim()
        ){

            setErroForm(
                "Informe razão social, nome fantasia e WhatsApp."
            );

            return;

        }

        try{

            setSalvando(true);
            setErroForm("");

            await api.criarEmpresa(form);

            setModalAberto(false);

            await carregarEmpresas();

        }catch(erro: any){

            console.error(
                "Erro ao criar empresa",
                erro
            );

            setErroForm(
                erro?.response?.data?.erro
                ??
                "Não foi possível salvar a empresa. Tente novamente."
            );

        }finally{

            setSalvando(false);

        }

    }



    const empresasFiltradas =
        empresas.filter((empresa)=>{

            const termo =
                busca.toLowerCase();


            return (

                empresa.nome_fantasia
                    ?.toLowerCase()
                    .includes(termo)

                ||

                empresa.cnpj
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

                    onClick={abrirModal}

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

                                        {empresa.nome_fantasia}

                                    </div>

                                </td>


                                <td>

                                    {empresa.cnpj ?? "-"}

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
                            width:480,
                            maxWidth:"92vw",
                            maxHeight:"88vh",
                            overflowY:"auto"
                        }}

                    >

                        <h3

                            style={{
                                fontSize:20,
                                fontWeight:700,
                                marginBottom:18
                            }}

                        >

                            Nova empresa

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

                                Razão social *

                                <input

                                    value={form.razao_social}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            razao_social: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                Nome fantasia *

                                <input

                                    value={form.nome_fantasia}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            nome_fantasia: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                WhatsApp *

                                <input

                                    value={form.whatsapp}

                                    placeholder="5511999999999"

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            whatsapp: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                CNPJ

                                <input

                                    value={form.cnpj}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            cnpj: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                Telefone

                                <input

                                    value={form.telefone}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            telefone: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                E-mail

                                <input

                                    value={form.email}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <div style={{display:"flex", gap:12}}>

                                <label style={{flex:1}}>

                                    Cidade

                                    <input

                                        value={form.cidade}

                                        onChange={(e)=>
                                            setForm({
                                                ...form,
                                                cidade: e.target.value
                                            })
                                        }

                                    />

                                </label>


                                <label style={{width:80}}>

                                    UF

                                    <input

                                        value={form.uf}

                                        maxLength={2}

                                        onChange={(e)=>
                                            setForm({
                                                ...form,
                                                uf: e.target.value.toUpperCase()
                                            })
                                        }

                                    />

                                </label>

                            </div>


                            <label>

                                Observações

                                <textarea

                                    value={form.observacoes}

                                    rows={3}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            observacoes: e.target.value
                                        })
                                    }

                                />

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

                                onClick={salvarEmpresa}

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

                                {salvando ? "Salvando..." : "Salvar empresa"}

                            </button>

                        </div>

                    </div>

                </div>

            )

            }


        </div>

    );

}
