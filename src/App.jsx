import "./App.css";

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

import Layout from "./components/Layout";

import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Blog from "./pages/Blog";
import Artigo from "./pages/Artigo";
import Parcerias from "./pages/Parcerias";
import Sobre from "./pages/Sobre";

const josylinhasRoutes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
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