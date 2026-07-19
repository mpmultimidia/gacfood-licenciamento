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
    UsuarioDTO,
    NovoUsuarioDTO
} from "../api/cliente";


export default function Usuarios() {


    const [usuarios,setUsuarios] = useState<UsuarioDTO[]>([]);

    const [busca,setBusca] = useState("");

    const [carregando,setCarregando] = useState(false);

    const [modalAberto,setModalAberto] = useState(false);

    const [salvando,setSalvando] = useState(false);

    const [erroForm,setErroForm] = useState("");

    const [usuarioEditando,setUsuarioEditando] = useState<UsuarioDTO | null>(null);

    const [excluindo,setExcluindo] = useState<string | null>(null);

    const formVazio: NovoUsuarioDTO = {
        nome: "",
        login: "",
        senha: "",
        perfil: "operador"
    };

    const [form,setForm] = useState<NovoUsuarioDTO>(formVazio);



    function abrirModal(usuario?: UsuarioDTO){

        if(usuario){

            setUsuarioEditando(usuario);

            setForm({
                nome: usuario.nome,
                login: usuario.login,
                senha: "",
                perfil: usuario.perfil
            });

        }else{

            setUsuarioEditando(null);
            setForm(formVazio);

        }

        setErroForm("");
        setModalAberto(true);

    }



    function fecharModal(){

        if(salvando) return;

        setModalAberto(false);

    }



    async function salvarUsuario(){

        if(!form.nome.trim() || !form.login.trim()){

            setErroForm("Informe nome e login.");

            return;

        }

        if(!usuarioEditando && !form.senha.trim()){

            setErroForm("Informe a senha.");

            return;

        }

        try{

            setSalvando(true);
            setErroForm("");

            if(usuarioEditando){

                const dados: any = {
                    nome: form.nome,
                    login: form.login,
                    perfil: form.perfil
                };

                if(form.senha.trim()){
                    dados.senha = form.senha;
                }

                await api.atualizarUsuario(
                    usuarioEditando.id,
                    dados
                );

            }else{

                await api.criarUsuario(form);

            }

            setModalAberto(false);

            await carregarUsuarios();

        }catch(erro: any){

            console.error("Erro ao salvar usuário", erro);

            setErroForm(
                erro?.response?.data?.erro
                ??
                "Não foi possível salvar o usuário."
            );

        }finally{

            setSalvando(false);

        }

    }



    async function excluirUsuario(usuario: UsuarioDTO){

        const confirmou = window.confirm(
            `Desativar o acesso de "${usuario.nome}"?`
        );

        if(!confirmou) return;

        try{

            setExcluindo(usuario.id);

            await api.excluirUsuario(usuario.id);

            await carregarUsuarios();

        }catch(erro){

            console.error("Erro ao excluir usuário", erro);

            alert("Não foi possível excluir o usuário.");

        }finally{

            setExcluindo(null);

        }

    }



    async function carregarUsuarios(){

        try{

            setCarregando(true);

            const resposta =
                await api.listarUsuarios();


            setUsuarios(
                resposta.data.usuarios ?? []
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

                usuario.login
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

                    onClick={()=> abrirModal()}

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
                                    Login
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

                        usuariosFiltrados.length === 0

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

                                    {usuario.login}

                                </td>


                                <td>

                                    <span

                                        style={{
                                            background: usuario.ativo ? "#dcfce7" : "#fef2f2",
                                            color: usuario.ativo ? "#166534" : "#dc2626",
                                            padding:"5px 10px",
                                            borderRadius:20,
                                            fontSize:12
                                        }}

                                    >

                                        {usuario.ativo ? "Ativo" : "Inativo"}

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

                                            onClick={()=> abrirModal(usuario)}

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

                                            onClick={()=> excluirUsuario(usuario)}

                                            disabled={excluindo === usuario.id}

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

                            {usuarioEditando ? "Editar usuário" : "Novo usuário"}

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

                                Nome *

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

                                Login *

                                <input

                                    value={form.login}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            login: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                {usuarioEditando ? "Nova senha (deixe em branco para manter a atual)" : "Senha *"}

                                <input

                                    type="password"

                                    value={form.senha}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            senha: e.target.value
                                        })
                                    }

                                />

                            </label>


                            <label>

                                Perfil

                                <select

                                    value={form.perfil}

                                    onChange={(e)=>
                                        setForm({
                                            ...form,
                                            perfil: e.target.value
                                        })
                                    }

                                >

                                    <option value="operador">Operador</option>
                                    <option value="admin">Admin</option>

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

                                onClick={salvarUsuario}

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

                                {salvando ? "Salvando..." : (usuarioEditando ? "Salvar alterações" : "Criar usuário")}

                            </button>

                        </div>

                    </div>

                </div>

            )

            }


        </div>

    );

}