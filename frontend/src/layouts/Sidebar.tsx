import {

    NavLink

} from "react-router-dom";


import {

    LayoutDashboard,

    Building2,

    Users,

    Package,

    KeyRound,

    Puzzle,

    Settings,

    FileText,

    History,

    Activity,

    LogOut

} from "lucide-react";


import {

    useAuth

} from "../contexts/AuthContext";




export default function Sidebar(){


    const {

        sair,

        usuario

    } = useAuth();




    const menuCompleto = [


        {

            nome:"Dashboard",

            rota:"/dashboard",

            icone:<LayoutDashboard/>,

            somenteAdministrador:true

        },


        {

            nome:"Empresas",

            rota:"/empresas",

            icone:<Building2/>

        },


        {

            nome:"Usuários",

            rota:"/usuarios",

            icone:<Users/>

        },


        {

            nome:"Planos",

            rota:"/planos",

            icone:<Package/>

        },


        {

            nome:"Licenças",

            rota:"/licencas",

            icone:<KeyRound/>

        },


        {

            nome:"Módulos",

            rota:"/modulos",

            icone:<Puzzle/>

        },


        {

            nome:"Configurações",

            rota:"/configuracoes",

            icone:<Settings/>

        },


        {

            nome:"Logs",

            rota:"/logs",

            icone:<FileText/>

        },


        {

            nome:"Histórico",

            rota:"/historico",

            icone:<History/>

        },


        {

            nome:"Saúde",

            rota:"/saude",

            icone:<Activity/>

        }


    ];


    const menu = menuCompleto.filter((item)=>

        !item.somenteAdministrador || usuario?.tipo === "administrador"

    );




    return (


        <aside


            style={{


                width:260,

                background:"#111827",

                color:"#ffffff",

                padding:20,

                display:"flex",

                flexDirection:"column"


            }}


        >


            <h2

                style={{

                    marginBottom:30

                }}

            >

                GACFOOD

            </h2>




            <nav

                style={{

                    flex:1

                }}

            >


            {

            menu.map(item=>(


                <NavLink


                    key={item.rota}


                    to={item.rota}


                    style={({isActive})=>({


                        display:"flex",

                        alignItems:"center",

                        gap:12,

                        padding:"12px",

                        marginBottom:6,

                        borderRadius:8,

                        color:"#ffffff",

                        textDecoration:"none",

                        background:

                        isActive

                        ?

                        "#2563eb"

                        :

                        "transparent"


                    })}


                >


                    {item.icone}


                    {item.nome}


                </NavLink>


            ))


            }


            </nav>




            <button


                onClick={sair}


                style={{


                    display:"flex",

                    alignItems:"center",

                    gap:10,

                    padding:12,

                    background:"#dc2626",

                    color:"#ffffff",

                    border:"none",

                    borderRadius:8


                }}


            >


                <LogOut size={18}/>


                Sair


            </button>



        </aside>


    );


}