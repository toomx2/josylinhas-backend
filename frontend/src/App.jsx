import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./contexts/AuthContext";

import AdminLayout from "./components/AdminLayout";
import Layout from "./components/Layout";

import Admin from "./pages/Admin";
import CadastrarAdmin from "./pages/CadastrarAdmin";
import ListaArtigos from "./pages/ListaArtigos";
import FormArtigo from "./pages/FormArtigo";
import ListaUsuarios from "./pages/ListaUsuarios";

import AlterarSenha from "./pages/AlterarSenha";
import EsqueciSenha from "./pages/EsqueciSenha";
import EditarPerfil from "./pages/EditarPerfil";
import Login from "./pages/Login";

import Artigo from "./pages/Artigo";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Parcerias from "./pages/Parcerias";
import Sobre from "./pages/Sobre";

import AdminRoute from "./routes/AdminRoute";
import AuthRoute from "./routes/AuthRoute";
import GuestRoute from "./routes/GuestRoute";
import RouteErrorBoundary from "./routes/RouteErrorBoundary";

import NotFound from "./pages/status/NotFound";

const josylinhasRoutes = createBrowserRouter([
    {
        path: "/admin",
        element: <AdminRoute />,
        children: [
            {
                element: <AdminLayout />,
                errorElement: <RouteErrorBoundary />,
                children: [
                    {
                        element: <Admin />,
                        index: true
                    },

                    {
                        path: "artigos",
                        element: <ListaArtigos />
                    },

                    {
                        path: "artigos/novo",
                        element: <FormArtigo />
                    },

                    {
                        path: "artigos/editar/:id",
                        element: <FormArtigo />
                    },

                    {
                        path: "usuarios",
                        element: <ListaUsuarios />
                    },

                    {
                        path: "usuarios/novo",
                        element: <CadastrarAdmin />
                    }
                ]
            }
        ]
    },

    {
        path: "/",
        element: <Layout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                element: <AuthRoute />,
                children: [
                    {
                        path: "editar-perfil",
                        element: <EditarPerfil />
                    }
                ]
            },

            {
                path: "artigo",
                element: <Artigo />
            },

            {
                path: "blog",
                element: <Blog />
            },

            {
                element: <Home />,
                index: true
            },

            {
                path: "produtos",
                element: <Produtos />
            },

            {
                path: "parcerias",
                element: <Parcerias />
            },

            {
                path: "sobre",
                element: <Sobre />
            },

            {
                element: <GuestRoute />,
                children: [
                    {
                        path: "alterar-senha/:token",
                        element: <AlterarSenha />
                    },

                    {
                        path: "esqueci-senha",
                        element: <EsqueciSenha />
                    },

                    {
                        path: "login",
                        element: <Login />
                    }
                ]
            },

            {
                path: "nao-encontrada",
                element: <NotFound />
            }
        ]
    },

    {
        path: "*",
        element: <NotFound />
    }
]);

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={josylinhasRoutes} />
            <ToastContainer
                position="top-right"
                theme="light"
                autoClose={3000}
            />
        </AuthProvider>
    );
};

export default App;