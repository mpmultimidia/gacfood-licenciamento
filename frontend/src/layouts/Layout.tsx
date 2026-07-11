import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {

    return (

        <div
            style={{
                display: "flex",
                width: "100%",
                height: "100vh",
                background: "#f3f4f6"
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                }}
            >

                <Header />

                <main
                    style={{
                        flex: 1,
                        overflow: "auto",
                        padding: 24
                    }}
                >

                    <Outlet />

                </main>

            </div>

        </div>

    );

}