import {
    createBrowserRouter
} from "react-router-dom";


import Layout from "../layouts/Layout";


import ProtectedRoute from "../components/ProtectedRoute";
import SomenteAdministrador from "../components/SomenteAdministrador";
import RedirecionamentoInicial from "../components/RedirecionamentoInicial";


import Login from "../pages/Login";


import Dashboard from "../pages/Dashboard";
import Empresas from "../pages/Empresas";
import Usuarios from "../pages/Usuarios";
import Planos from "../pages/Planos";
import Licencas from "../pages/Licencas";
import Modulos from "../pages/Modulos";
import Configuracoes from "../pages/Configuracoes";
import Logs from "../pages/Logs";
import Historico from "../pages/Historico";
import Saude from "../pages/Saude";




const router = createBrowserRouter([


    {


        path:"/login",

        element:<Login/>


    },



    {


        path:"/",


        element:<ProtectedRoute/>,


        children:[


            {


                element:<Layout/>,


                children:[


                    {

                        index:true,

                        element:
                        <RedirecionamentoInicial/>

                    },


                    {

                        element:<SomenteAdministrador/>,

                        children:[

                            {

                                path:"dashboard",

                                element:<Dashboard/>

                            }

                        ]

                    },


                    {

                        path:"empresas",

                        element:<Empresas/>

                    },


                    {

                        path:"usuarios",

                        element:<Usuarios/>

                    },


                    {

                        path:"planos",

                        element:<Planos/>

                    },


                    {

                        path:"licencas",

                        element:<Licencas/>

                    },


                    {

                        path:"modulos",

                        element:<Modulos/>

                    },


                    {

                        path:"configuracoes",

                        element:<Configuracoes/>

                    },


                    {

                        path:"logs",

                        element:<Logs/>

                    },


                    {

                        path:"historico",

                        element:<Historico/>

                    },


                    {

                        path:"saude",

                        element:<Saude/>

                    }


                ]

            }


        ]


    }


]);


export default router;