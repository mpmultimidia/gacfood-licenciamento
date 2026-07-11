import {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {
    LockKeyhole
} from "lucide-react";


import {
    useAuth
} from "../contexts/AuthContext";



export default function Login(){


    const navigate =
        useNavigate();



    const {
        entrar
    } = useAuth();



    const [email,setEmail] =
        useState("");



    const [senha,setSenha] =
        useState("");





    function login(e:React.FormEvent){


        e.preventDefault();



        entrar({

            id:"1",

            nome:"Administrador",

            email,

            perfil:"ADMIN"

        });



        navigate(
            "/dashboard"
        );


    }




    return (

        <div

            style={{

                minHeight:"100vh",

                display:"flex",

                justifyContent:"center",

                alignItems:"center",

                background:"#f3f4f6"

            }}

        >


            <form

                onSubmit={login}

                style={{

                    width:380,

                    background:"#ffffff",

                    padding:35,

                    borderRadius:15,

                    boxShadow:
                    "0 10px 30px rgba(0,0,0,.08)"

                }}

            >


                <div

                    style={{

                        textAlign:"center",

                        marginBottom:25

                    }}

                >

                    <LockKeyhole

                        size={45}

                        color="#2563eb"

                    />


                    <h2>

                        GACFOOD

                    </h2>


                    <p>

                        Acesso administrativo

                    </p>


                </div>



                <input

                    placeholder="E-mail"

                    value={email}

                    onChange={(e)=>
                        setEmail(
                            e.target.value
                        )
                    }

                    style={{

                        width:"100%",

                        padding:12,

                        marginBottom:15

                    }}

                />



                <input

                    type="password"

                    placeholder="Senha"

                    value={senha}

                    onChange={(e)=>
                        setSenha(
                            e.target.value
                        )
                    }

                    style={{

                        width:"100%",

                        padding:12,

                        marginBottom:20

                    }}

                />



                <button

                    style={{

                        width:"100%",

                        padding:12,

                        background:"#2563eb",

                        color:"#fff",

                        border:"none",

                        borderRadius:8,

                        fontWeight:600

                    }}

                >

                    Entrar

                </button>


            </form>


        </div>

    );

}