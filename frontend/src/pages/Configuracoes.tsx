import { useEffect, useState } from "react";

import {
    Settings,
    Save,
    Database,
    ShieldCheck,
    Globe
} from "lucide-react";

import Card from "../components/Card";

import api from "../api/cliente";


interface Configuracao {

    nome?: string;

    valor?: string;

}



export default function Configuracoes() {


    const [configuracoes,setConfiguracoes] =
        useState<Configuracao[]>([]);


    const [carregando,setCarregando] =
        useState(false);



    async function carregarConfiguracoes(){

        try{

            setCarregando(true);


            const resposta =
                await api.listarConfiguracoes();


            setConfiguracoes(
                resposta.data ?? []
            );


        }catch(erro){

            console.error(
                "Erro ao carregar configurações",
                erro
            );


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        carregarConfiguracoes();

    },[]);



    async function salvar(){

        try{

            await api.salvarConfiguracoes(
                configuracoes
            );


            alert(
                "Configurações salvas com sucesso."
            );


        }catch(erro){

            console.error(
                "Erro ao salvar configurações",
                erro
            );


            alert(
                "Erro ao salvar configurações."
            );

        }

    }



    return (

        <div>


            <div

                style={{
                    marginBottom:25
                }}

            >

                <h2

                    style={{
                        fontSize:28,
                        fontWeight:700,
                        display:"flex",
                        alignItems:"center",
                        gap:10
                    }}

                >

                    <Settings/>

                    Configurações

                </h2>


                <p

                    style={{
                        color:"#6b7280"
                    }}

                >

                    Parâmetros gerais do sistema.

                </p>


            </div>



            {

            carregando

            ?

            (

                <Card>

                    <div

                        style={{
                            textAlign:"center",
                            padding:40
                        }}

                    >

                        Carregando configurações...

                    </div>

                </Card>

            )


            :

            (

            <div

                style={{
                    display:"grid",
                    gap:20
                }}

            >


                <Card

                    titulo="Sistema"

                >

                    <div

                        style={{
                            display:"grid",
                            gap:18
                        }}

                    >

                        <ConfigItem

                            icone={<Globe size={20}/>}

                            titulo="Ambiente"

                            valor="Produção"

                        />


                        <ConfigItem

                            icone={<Database size={20}/>}

                            titulo="Banco de dados"

                            valor="Configurado"

                        />


                        <ConfigItem

                            icone={<ShieldCheck size={20}/>}

                            titulo="Segurança"

                            valor="Ativa"

                        />


                    </div>


                </Card>



                <Card

                    titulo="Configurações carregadas"

                >

                    {

                    configuracoes.length === 0

                    ?

                    (

                        <p>

                            Nenhuma configuração encontrada.

                        </p>

                    )


                    :

                    configuracoes.map(
                        (item,index)=>(


                        <div

                            key={index}

                            style={{
                                display:"grid",
                                gridTemplateColumns:"1fr 1fr",
                                gap:15,
                                marginBottom:15
                            }}

                        >

                            <input

                                value={
                                    item.nome ?? ""
                                }

                                readOnly

                            />


                            <input

                                value={
                                    item.valor ?? ""
                                }

                                onChange={(e)=>{


                                    const copia =
                                        [...configuracoes];


                                    copia[index].valor =
                                        e.target.value;


                                    setConfiguracoes(
                                        copia
                                    );


                                }}

                            />


                        </div>


                    ))

                    }


                </Card>



                <button

                    onClick={salvar}

                    style={{
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        gap:10,
                        width:180,
                        padding:"12px 18px",
                        background:"#2563eb",
                        color:"#ffffff",
                        border:"none",
                        borderRadius:8,
                        fontWeight:600
                    }}

                >

                    <Save size={18}/>

                    Salvar

                </button>



            </div>

            )

            }


        </div>

    );

}



function ConfigItem({

    icone,

    titulo,

    valor

}:{

    icone:React.ReactNode;

    titulo:string;

    valor:string;

}){

    return (

        <div

            style={{
                display:"flex",
                alignItems:"center",
                gap:15,
                padding:15,
                border:"1px solid #e5e7eb",
                borderRadius:10
            }}

        >

            {icone}


            <div>

                <div

                    style={{
                        fontWeight:600
                    }}

                >

                    {titulo}

                </div>


                <div

                    style={{
                        color:"#6b7280",
                        fontSize:13
                    }}

                >

                    {valor}

                </div>


            </div>


        </div>

    );

}