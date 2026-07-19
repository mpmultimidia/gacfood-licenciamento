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

    const [codigoAtivacao,setCodigoAtivacao] = useState<{codigo:string; expira_em:string} | null>(null);

    const [gerandoCodigo,setGerandoCodigo] = useState(false);

    const [erroCodigoAtivacao,setErroCodigoAtivacao] = useState("");

    const [codigoLinhaAberto,setCodigoLinhaAberto] = useState<LicencaDTO | null>(null);

    const [codigoLinha,setCodigoLinha] = useState<{codigo:string; expira_em:string} | null>(null);

    const [gerandoCodigoLinha,setGerandoCodigoLinha] = useState(false);

    const [erroCodigoLinha,setErroCodigoLinha] = useState("");



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
        setCodigoAtivacao(null);
        setErroCodigoAtivacao("");
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

            // Gera o código de 6 dígitos automaticamente, sem precisar
            // de um clique a mais — é o que o instalador do GACFOOD pede.
            const empresa = empresas.find(
                (e)=> e.id === form.empresa_id
            );

            if(empresa){

                try{

                    setGerandoCodigo(true);

                    const respostaCodigo =
                        await api.solicitarCodigoAtivacao(
                            empresa.codigo
                        );

                    setCodigoAtivacao(
                        respostaCodigo.data.codigoAtivacao
                    );

                }catch(erroCodigo: any){

                    console.error(
                        "Erro ao gerar código de instalação",
                        erroCodigo
                    );

                    setErroCodigoAtivacao(
                        erroCodigo?.response?.data?.erro
                        ??
                        "Licença emitida, mas não foi possível gerar o código de instalação. Use o botão abaixo para tentar de novo."
                    );

                }finally{

                    setGerandoCodigo(false);

                }

            }

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



    async function gerarCodigoInstalacao(){

        const empresa = empresas.find(
            (e)=> e.id === form.empresa_id
        );

        if(!empresa){

            setErroCodigoAtivacao(
                "Empresa não encontrada."
            );

            return;

        }

        try{

            setGerandoCodigo(true);
            setErroCodigoAtivacao("");

            const resposta =
                await api.solicitarCodigoAtivacao(
                    empresa.codigo
                );

            setCodigoAtivacao(
                resposta.data.codigoAtivacao
            );

        }catch(erro: any){

            console.error(
                "Erro ao gerar código de instalação",
                erro
            );

            setErroCodigoAtivacao(
                erro?.response?.data?.erro
                ??
                "Não foi possível gerar o código. Tente novamente."
            );

        }finally{

            setGerandoCodigo(false);

        }

    }



    function abrirCodigoLinha(licenca: LicencaDTO){

        setCodigoLinhaAberto(licenca);
        setCodigoLinha(null);
        setErroCodigoLinha("");

    }



    const [licencaEditando,setLicencaEditando] = useState<LicencaDTO | null>(null);

    const [formEdicao,setFormEdicao] = useState<{status:string; plano_id:string}>({
        status: "ATIVA",
        plano_id: ""
    });

    const [salvandoEdicao,setSalvandoEdicao] = useState(false);

    const [erroEdicao,setErroEdicao] = useState("");

    const [excluindoLicenca,setExcluindoLicenca] = useState<string | null>(null);



    async function abrirEdicaoLicenca(licenca: LicencaDTO){

        setLicencaEditando(licenca);

        setFormEdicao({
            status: licenca.status,
            plano_id: licenca.planoId
        });

        setErroEdicao("");

        if(planos.length === 0){

            try{

                const respostaPlanos = await api.listarPlanos();
                setPlanos(respostaPlanos.data ?? []);

            }catch(erro){

                console.error("Erro ao carregar planos", erro);

            }

        }

    }



    function fecharEdicaoLicenca(){

        if(salvandoEdicao) return;

        setLicencaEditando(null);

    }



    async function salvarEdicaoLicenca(){

        if(!licencaEditando) return;

        try{

            setSalvandoEdicao(true);
            setErroEdicao("");

            await api.atualizarLicenca(
                licencaEditando.id,
                formEdicao
            );

            setLicencaEditando(null);

            await carregarLicencas();

        }catch(erro: any){

            console.error("Erro ao atualizar licença", erro);

            setErroEdicao(
                erro?.response?.data?.erro
                ??
                "Não foi possível salvar as alterações."
            );

        }finally{

            setSalvandoEdicao(false);

        }

    }



    async function excluirLicencaAcao(licenca: LicencaDTO){

        const confirmou = window.confirm(
            `Cancelar a licença de "${licenca.empresa}"? Isso não apaga o histórico, só marca a licença como CANCELADA.`
        );

        if(!confirmou) return;

        try{

            setExcluindoLicenca(licenca.id);

            await api.excluirLicenca(licenca.id);

            await carregarLicencas();

        }catch(erro){

            console.error("Erro ao cancelar licença", erro);

            alert("Não foi possível cancelar a licença.");

        }finally{

            setExcluindoLicenca(null);

        }

    }



    function fecharCodigoLinha(){

        if(gerandoCodigoLinha) return;

        setCodigoLinhaAberto(null);

    }



    async function gerarCodigoDaLinha(){

        if(!codigoLinhaAberto?.empresaCodigo){

            setErroCodigoLinha(
                "Código da empresa não encontrado."
            );

            return;

        }

        try{

            setGerandoCodigoLinha(true);
            setErroCodigoLinha("");

            const resposta =
                await api.solicitarCodigoAtivacao(
                    codigoLinhaAberto.empresaCodigo
                );

            setCodigoLinha(
                resposta.data.codigoAtivacao
            );

        }catch(erro: any){

            console.error(
                "Erro ao gerar código de instalação",
                erro
            );

            setErroCodigoLinha(
                erro?.response?.data?.erro
                ??
                "Não foi possível gerar o código. Tente novamente."
            );

        }finally{

            setGerandoCodigoLinha(false);

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

                                            onClick={()=> abrirCodigoLinha(licenca)}

                                            title="Gerar código de instalação"

                                            style={{
                                                border:"none",
                                                background:"#f0fdf4",
                                                padding:8,
                                                borderRadius:6
                                            }}

                                        >

                                            <KeyRound
                                                size={16}
                                                color="#16a34a"
                                            />

                                        </button>


                                        <button

                                            onClick={()=> abrirEdicaoLicenca(licenca)}

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

                                            onClick={()=> excluirLicencaAcao(licenca)}

                                            disabled={excluindoLicenca === licenca.id}

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
                                        borderTop:"1px solid #e5e7eb",
                                        paddingTop:16,
                                        marginBottom:20
                                    }}

                                >

                                    <div

                                        style={{
                                            fontSize:14,
                                            color:"#374151",
                                            marginBottom:10
                                        }}

                                    >

                                        No instalador do GACFOOD, o cliente vai pedir um <b>código de 6 dígitos</b> (diferente do código da licença acima). Gere aqui e envie por WhatsApp:

                                    </div>


                                    {

                                    erroCodigoAtivacao &&

                                    (

                                        <div

                                            style={{
                                                background:"#fef2f2",
                                                color:"#dc2626",
                                                padding:"10px 14px",
                                                borderRadius:8,
                                                marginBottom:12,
                                                fontSize:14
                                            }}

                                        >

                                            {erroCodigoAtivacao}

                                        </div>

                                    )

                                    }


                                    {

                                    codigoAtivacao

                                    ?

                                    (

                                        <div

                                            style={{
                                                display:"flex",
                                                alignItems:"center",
                                                gap:10,
                                                border:"1px solid #e5e7eb",
                                                borderRadius:8,
                                                padding:"14px 16px"
                                            }}

                                        >

                                            <span

                                                style={{
                                                    fontFamily:"monospace",
                                                    fontSize:22,
                                                    fontWeight:700,
                                                    letterSpacing:3,
                                                    flex:1
                                                }}

                                            >

                                                {codigoAtivacao.codigo}

                                            </span>


                                            <button

                                                onClick={()=>
                                                    navigator.clipboard.writeText(
                                                        codigoAtivacao.codigo
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

                                    )

                                    :

                                    (

                                        <button

                                            onClick={gerarCodigoInstalacao}

                                            disabled={gerandoCodigo}

                                            style={{
                                                border:"1px solid #2563eb",
                                                background:"#eff6ff",
                                                color:"#2563eb",
                                                padding:"10px 18px",
                                                borderRadius:8,
                                                fontWeight:600,
                                                width:"100%"
                                            }}

                                        >

                                            {gerandoCodigo ? "Gerando..." : "Gerar código de instalação"}

                                        </button>

                                    )

                                    }


                                    {

                                    codigoAtivacao &&

                                    (

                                        <div

                                            style={{
                                                fontSize:12,
                                                color:"#9ca3af",
                                                marginTop:8
                                            }}

                                        >

                                            Válido até {new Date(codigoAtivacao.expira_em).toLocaleTimeString('pt-BR')}.

                                        </div>

                                    )

                                    }

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


            {

            codigoLinhaAberto &&

            (

                <div

                    onClick={fecharCodigoLinha}

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
                            width:400,
                            maxWidth:"92vw"
                        }}

                    >

                        <h3

                            style={{
                                fontSize:18,
                                fontWeight:700,
                                marginBottom:6
                            }}

                        >

                            Código de instalação

                        </h3>


                        <p

                            style={{
                                color:"#6b7280",
                                fontSize:14,
                                marginBottom:16
                            }}

                        >

                            {codigoLinhaAberto.empresa}

                        </p>


                        {

                        erroCodigoLinha &&

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

                                {erroCodigoLinha}

                            </div>

                        )

                        }


                        {

                        codigoLinha

                        ?

                        (

                            <>

                            <div

                                style={{
                                    display:"flex",
                                    alignItems:"center",
                                    gap:10,
                                    border:"1px solid #e5e7eb",
                                    borderRadius:8,
                                    padding:"14px 16px",
                                    marginBottom:8
                                }}

                            >

                                <span

                                    style={{
                                        fontFamily:"monospace",
                                        fontSize:22,
                                        fontWeight:700,
                                        letterSpacing:3,
                                        flex:1
                                    }}

                                >

                                    {codigoLinha.codigo}

                                </span>


                                <button

                                    onClick={()=>
                                        navigator.clipboard.writeText(
                                            codigoLinha.codigo
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
                                    fontSize:12,
                                    color:"#9ca3af",
                                    marginBottom:20
                                }}

                            >

                                Válido até {new Date(codigoLinha.expira_em).toLocaleTimeString('pt-BR')}.

                            </div>

                            </>

                        )

                        :

                        (

                            <button

                                onClick={gerarCodigoDaLinha}

                                disabled={gerandoCodigoLinha}

                                style={{
                                    border:"1px solid #2563eb",
                                    background:"#eff6ff",
                                    color:"#2563eb",
                                    padding:"10px 18px",
                                    borderRadius:8,
                                    fontWeight:600,
                                    width:"100%",
                                    marginBottom:20
                                }}

                            >

                                {gerandoCodigoLinha ? "Gerando..." : "Gerar código"}

                            </button>

                        )

                        }


                        <div

                            style={{
                                display:"flex",
                                justifyContent:"flex-end"
                            }}

                        >

                            <button

                                onClick={fecharCodigoLinha}

                                style={{
                                    border:"1px solid #e5e7eb",
                                    background:"#ffffff",
                                    padding:"10px 18px",
                                    borderRadius:8,
                                    fontWeight:600
                                }}

                            >

                                Fechar

                            </button>

                        </div>

                    </div>

                </div>

            )

            }


            {

            licencaEditando &&

            (

                <div

                    onClick={fecharEdicaoLicenca}

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
                            width:400,
                            maxWidth:"92vw"
                        }}

                    >

                        <h3

                            style={{
                                fontSize:18,
                                fontWeight:700,
                                marginBottom:6
                            }}

                        >

                            Editar licença

                        </h3>


                        <p

                            style={{
                                color:"#6b7280",
                                fontSize:14,
                                marginBottom:16
                            }}

                        >

                            {licencaEditando.empresa} — {licencaEditando.codigo_licenca}

                        </p>


                        {

                        erroEdicao &&

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

                                {erroEdicao}

                            </div>

                        )

                        }


                        <div style={{display:"flex", flexDirection:"column", gap:12}}>

                            <label>

                                Status

                                <select

                                    value={formEdicao.status}

                                    onChange={(e)=>
                                        setFormEdicao({
                                            ...formEdicao,
                                            status: e.target.value
                                        })
                                    }

                                >

                                    <option value="ATIVA">Ativa</option>
                                    <option value="EXPIRADA">Expirada</option>
                                    <option value="CANCELADA">Cancelada</option>

                                </select>

                            </label>


                            <label>

                                Plano

                                <select

                                    value={formEdicao.plano_id}

                                    onChange={(e)=>
                                        setFormEdicao({
                                            ...formEdicao,
                                            plano_id: e.target.value
                                        })
                                    }

                                >

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

                                onClick={fecharEdicaoLicenca}

                                disabled={salvandoEdicao}

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

                                onClick={salvarEdicaoLicenca}

                                disabled={salvandoEdicao}

                                style={{
                                    border:"none",
                                    background:"#2563eb",
                                    color:"#ffffff",
                                    padding:"10px 18px",
                                    borderRadius:8,
                                    fontWeight:600
                                }}

                            >

                                {salvandoEdicao ? "Salvando..." : "Salvar alterações"}

                            </button>

                        </div>

                    </div>

                </div>

            )

            }


        </div>

    );

}