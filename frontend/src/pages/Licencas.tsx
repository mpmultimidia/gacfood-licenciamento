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
    LicencaDTO,
    NovaLicencaDTO,
    EmpresaDTO,
    PlanoDTO
} from "../api/cliente";


export default function Licencas() {


    const [licencas,setLicencas] = useState<LicencaDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);

    const [modalAberto,setModalAberto] = useState(false);

    const [salvando,setSalvando] = useState(false);

    const [erroForm,setErroForm] = useState("");

    const [empresas,setEmpresas] = useState<EmpresaDTO[]>([]);

    const [planos,setPlanos] = useState<PlanoDTO[]>([]);

    const [form,setForm] = useState<NovaLicencaDTO>({
        empresa_id: "",
        plano_id: ""
    });

    const [licencaCriada,setLicencaCriada] = useState<any>(null);



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



    async function abrirModal(){

        setForm({ empresa_id: "", plano_id: "" });
        setErroForm("");
        setLicencaCriada(null);
        setModalAberto(true);

        try{

            const [respEmpresas, respPlanos] = await Promise.all([
                api.listarEmpresas(),
                api.listarPlanos()
            ]);

            setEmpresas(respEmpresas.data.empresas ?? []);
            setPlanos(respPlanos.data ?? []);

        }catch(erro){

            console.error(
                "Erro ao carregar empresas/planos",
                erro
            );

        }

    }



    function fecharModal(){

        if(salvando) return;

        setModalAberto(false);

    }



    async function salvarLicenca(){

        if(!form.empresa_id || !form.plano_id){

            setErroForm(
                "Selecione a empresa e o plano."
            );

            return;

        }

        try{

            setSalvando(true);
            setErroForm("");

            const resposta = await api.criarLicenca(form);

            setLicencaCriada(resposta.data.licenca ?? null);

            await carregarLicencas();

        }catch(erro: any){

            console.error(
                "Erro ao emitir licença",
                erro
            );

            setErroForm(
                erro?.response?.data?.erro
                ??
                "Não foi possível emitir a licença. Tente novamente."
            );

        }finally{

            setSalvando(false);

        }

    }



    const licencasFiltradas =
        licencas.filter((licenca)=>{


            const termo =
                busca.toLowerCase();


            return (

                String(licenca.empresa ?? "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(licenca.plano ?? "")
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

                    onClick={abrirModal}

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
                                    Código
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

                                    colSpan={5}

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


                                        {licenca.empresa ?? "-"}


                                    </div>


                                </td>


                                <td

                                    style={{
                                        fontFamily:"monospace",
                                        fontSize:13
                                    }}

                                >

                                    {licenca.codigo_licenca ?? "-"}

                                </td>


                                <td>

                                    {licenca.plano ?? "-"}

                                </td>


                                <td>

                                    <span

                                        style={{
                                            background:
                                                licenca.status === "ATIVA"
                                                    ? "#dcfce7"
                                                    : "#fef2f2",
                                            color:
                                                licenca.status === "ATIVA"
                                                    ? "#166534"
                                                    : "#dc2626",
                                            padding:"5px 10px",
                                            borderRadius:20,
                                            fontSize:12
                                        }}

                                    >

                                        {licenca.status ?? "Ativa"}

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
                            width:440,
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

                            Nova licença

                        </h3>


                        {

                        licencaCriada &&

                        (

                            <div>

                                <div

                                    style={{
                                        background:"#dcfce7",
                                        color:"#166534",
                                        padding:"14px 16px",
                                        borderRadius:8,
                                        marginBottom:16,
                                        fontSize:14
                                    }}

                                >

                                    Licença emitida com sucesso! Envie este código para o cliente:

                                </div>


                                <div

                                    style={{
                                        display:"flex",
                                        alignItems:"center",
                                        gap:10,
                                        border:"1px solid #e5e7eb",
                                        borderRadius:8,
                                        padding:"14px 16px",
                                        marginBottom:20
                                    }}

                                >

                                    <span

                                        style={{
                                            fontFamily:"monospace",
                                            fontSize:18,
                                            fontWeight:700,
                                            flex:1
                                        }}

                                    >

                                        {licencaCriada.codigo_licenca}

                                    </span>


                                    <button

                                        onClick={()=>
                                            navigator.clipboard.writeText(
                                                licencaCriada.codigo_licenca
                                            )
                                        }

                                        style={{
                                            border:"1px solid #e5e7eb",
                                            background:"#f9fafb",
                                            padding:"8px 14px",
                                            borderRadius:6,
                                            fontWeight:600,
                                            fontSize:13
                                        }}

                                    >

                                        Copiar

                                    </button>

                                </div>


                                <div

                                    style={{
                                        display:"flex",
                                        justifyContent:"flex-end"
                                    }}

                                >

                                    <button

                                        onClick={fecharModal}

                                        style={{
                                            border:"none",
                                            background:"#2563eb",
                                            color:"#ffffff",
                                            padding:"10px 18px",
                                            borderRadius:8,
                                            fontWeight:600
                                        }}

                                    >

                                        Fechar

                                    </button>

                                </div>

                            </div>

                        )

                        }


                        {

                        !licencaCriada &&

                        (

                        <>


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

                                Empresa *

                                <select

                                    value={form.empresa_id}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            empresa_id: e.target.value
                                        })
                                    }

                                >

                                    <option value="">Selecione a empresa</option>

                                    {

                                    empresas.map((empresa)=>(

                                        <option

                                            key={empresa.id}
                                            value={empresa.id}

                                        >

                                            {empresa.nome_fantasia}

                                        </option>

                                    ))

                                    }

                                </select>

                            </label>


                            <label>

                                Plano *

                                <select

                                    value={form.plano_id}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            plano_id: e.target.value
                                        })
                                    }

                                >

                                    <option value="">Selecione o plano</option>

                                    {

                                    planos.map((plano)=>(

                                        <option

                                            key={plano.id}
                                            value={plano.id}

                                        >

                                            {plano.nome}

                                        </option>

                                    ))

                                    }

                                </select>

                            </label>


                            <label>

                                Validade (dias) — opcional, usa o padrão do plano se vazio

                                <input

                                    type="number"

                                    min={1}

                                    value={form.dias_validade ?? ""}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            dias_validade:
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : undefined
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

                                onClick={salvarLicenca}

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

                                {salvando ? "Emitindo..." : "Emitir licença"}

                            </button>

                        </div>


                        </>

                        )

                        }

                    </div>

                </div>

            )

            }


        </div>

    );

}