import { useEffect, useState } from "react";

import {
    Activity,
    Server,
    Database,
    Wifi,
    ShieldCheck
} from "lucide-react";

import Card from "../components/Card";

import api from "../api/cliente";


interface StatusSistema {

    api?: boolean;

    banco?: boolean;

    licenciamento?: boolean;

    mensagem?: string;

}



export default function Saude() {


    const [status,setStatus] =
        useState<StatusSistema>({});


    const [carregando,setCarregando] =
        useState(false);



    async function verificarSaude(){

        try{

            setCarregando(true);


            const resposta =
                await api.saude();


            setStatus(
                resposta.data ?? {}
            );


        }catch(erro){

            console.error(
                "Erro ao verificar saúde do sistema",
                erro
            );


            setStatus({

                api:false,

                banco:false,

                licenciamento:false,

                mensagem:
                "Não foi possível conectar ao servidor."

            });


        }finally{

            setCarregando(false);

        }

    }



    useEffect(()=>{

        verificarSaude();

    },[]);



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

                    <Activity/>

                    Saúde do Sistema

                </h2>


                <p

                    style={{
                        color:"#6b7280"
                    }}

                >

                    Monitoramento dos serviços do aplicativo.

                </p>


            </div>




            {

            carregando

            ?

            (

                <Card>

                    <div

                        style={{
                            padding:40,
                            textAlign:"center"
                        }}

                    >

                        Verificando serviços...

                    </div>

                </Card>

            )


            :

            (

            <div

                style={{
                    display:"grid",
                    gridTemplateColumns:
                    "repeat(auto-fit,minmax(250px,1fr))",
                    gap:20
                }}

            >


                <StatusCard

                    icone={<Server/>}

                    titulo="API"

                    ativo={status.api}

                />


                <StatusCard

                    icone={<Database/>}

                    titulo="Banco de Dados"

                    ativo={status.banco}

                />


                <StatusCard

                    icone={<ShieldCheck/>}

                    titulo="Licenciamento"

                    ativo={status.licenciamento}

                />


                <StatusCard

                    icone={<Wifi/>}

                    titulo="Conectividade"

                    ativo={true}

                />


            </div>

            )

            }



            {

            status.mensagem &&

            <Card>

                <p

                    style={{
                        color:"#6b7280"
                    }}

                >

                    {status.mensagem}

                </p>

            </Card>

            }


        </div>

    );

}




function StatusCard({

    icone,

    titulo,

    ativo

}:{

    icone:React.ReactNode;

    titulo:string;

    ativo?:boolean;

}){


    return (

        <Card>


            <div

                style={{
                    display:"flex",
                    alignItems:"center",
                    gap:15
                }}

            >

                <div>

                    {icone}

                </div>


                <div>


                    <div

                        style={{
                            fontWeight:700,
                            fontSize:17
                        }}

                    >

                        {titulo}

                    </div>


                    <div

                        style={{
                            marginTop:5,
                            color:
                            ativo
                            ?
                            "#16a34a"
                            :
                            "#dc2626",
                            fontWeight:600,
                            fontSize:14
                        }}

                    >

                        {

                        ativo

                        ?

                        "Online"

                        :

                        "Offline"

                        }

                    </div>


                </div>


            </div>


        </Card>

    );

}