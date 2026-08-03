import "./App.css";

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

import Layout from "./components/Layout";

import Admin from "./pages/Admin";
import ListaArtigos from "./pages/ListaArtigos";
import ListaUsuarios from "./pages/ListaUsuarios";
import Cadastrar from "./pages/Cadastrar";
import Login from "./pages/Login";
import EsqueciSenha from "./pages/EsqueciSenha";
import AlterarSenha from "./pages/AlterarSenha";
import EditarPerfil from "./pages/EditarPerfil";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Blog from "./pages/Blog";
import Artigo from "./pages/Artigo";
import Parcerias from "./pages/Parcerias";
import Sobre from "./pages/Sobre";

import AdminRoute from "./routes/AdminRoute";
import AuthRoute from "./routes/AuthRoute";
import GuestRoute from "./routes/GuestRoute";
import RouteErrorBoundary from "./routes/RouteErrorBoundary";

import NotFound from "./pages/status/NotFound";

const josylinhasRoutes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<RouteErrorBoundary />}>

            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/artigos" element={<ListaArtigos />} />
                <Route path="/cadastrar" element={<Cadastrar />} />
                <Route path="/admin/usuarios" element={<ListaUsuarios />} />
            </Route>

            <Route element={<AuthRoute />}>
                <Route path="/editar-perfil" element={<EditarPerfil />} />
            </Route>

            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/alterar-senha/:token" element={<AlterarSenha />} />
            </Route>

            <Route element={<Home />} index />

            <Route path="/produtos" element={<Produtos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/artigo" element={<Artigo />} />
            <Route path="/parcerias" element={<Parcerias />} />
            <Route path="/sobre" element={<Sobre />} />

            <Route path="/nao-encontrada" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />

        </Route>
    )
);

const App = () => {
    return (
        <RouterProvider router={josylinhasRoutes} />
    );
};

export default App;