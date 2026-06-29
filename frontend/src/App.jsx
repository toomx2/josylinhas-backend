import "./App.css";

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

import Layout from "./components/Layout";

import Admin from "./pages/Admin";
import Cadastrar from "./pages/Cadastrar";
import Login from "./pages/Login";
import EsqueciSenha from "./pages/EsqueciSenha";
import AlterarSenha from "./pages/AlterarSenha";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Blog from "./pages/Blog";
import Artigo from "./pages/Artigo";
import Parcerias from "./pages/Parcerias";
import Sobre from "./pages/Sobre";

import ErrorBoundary from "./components/ErrorBoundary";

const josylinhasRoutes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/cadastrar" element={<Cadastrar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/alterar-senha" element={<AlterarSenha />} />
            <Route element={<Home />} index />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/artigo" element={<Artigo />} />
            <Route path="/parcerias" element={<Parcerias />} />
            <Route path="/sobre" element={<Sobre />} />
        </Route>
    )
);

const App = () => {
    return (
        <RouterProvider router={josylinhasRoutes} />
    );
};

export default App;