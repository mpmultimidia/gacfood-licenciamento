import { ReactNode } from "react";

interface Props {

    titulo?: string;

    children: ReactNode;

}

export default function Card({

    titulo,

    children

}: Props) {

    return (

        <section

            style={{
                background:"#ffffff",
                borderRadius:14,
                border:"1px solid #e5e7eb",
                boxShadow:"0 4px 14px rgba(0,0,0,.05)",
                overflow:"hidden"
            }}

        >

            {

                titulo &&

                <div

                    style={{
                        padding:"18px 22px",
                        borderBottom:"1px solid #e5e7eb",
                        fontSize:17,
                        fontWeight:700,
                        color:"#111827"
                    }}

                >

                    {titulo}

                </div>

            }


            <div

                style={{
                    padding:22
                }}

            >

                {children}

            </div>


        </section>

    );

}