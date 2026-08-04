import "./Header.css";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import JosylinhasLogo from "../assets/josylinhas-logo.png";

const Header = () => {

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAdmin, logout } = useAuth();


    async function handleLogout() {
        try {

            await logout();
            navigate(
                "/login",
                { replace: true }
            );

        } catch (error) {
            console.error("Erro na tentativa de logout:", error);
        }
    }

    return (
        <header className="josylinhas-header">
            <nav className="josylinhas-navbar">
                <div className="josylinhas-logo">
                    <Link to="/">
                        <img className="josylinhas-logo"
                            src={JosylinhasLogo}
                            width="100"
                            height="100"
                            alt="Josylinhas Logotipo" />
                    </Link>
                </div>

                <div className="josylinhas-menu">

                    <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="bi bi-list" aria-hidden="true"></span>
                    </div>

                    <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
                        <li>
                            <Link className="josylinhas-link link-primary" to="/">
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link className="josylinhas-link link-primary" to="/produtos">
                                Produtos
                            </Link>
                        </li>

                        <li>
                            <Link className="josylinhas-link link-primary" to="/blog">
                                Blog
                            </Link>
                        </li>

                        <li>
                            <Link className="josylinhas-link link-primary" to="/parcerias">
                                Parcerias
                            </Link>
                        </li>

                        <li>
                            <Link className="josylinhas-link link-primary" to="/sobre">
                                Sobre
                            </Link>
                        </li>

                        {
                            user && (
                                <div className="dropdown d-flex flex-grow-1 justify-content-end">
                                    <button className="josylinhas-btn text-primary dropdown-toggle gap-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Perfil">
                                        <span className="bi bi-person-circle fs-3" aria-hidden="true" />
                                    </button>
                                    <ul className="dropdown-menu">
                                        {
                                            isAdmin && (
                                                <li className="dropdown-item">
                                                    <Link className="josylinhas-link link-primary w-100" to="/admin" title="Painel Admin">
                                                        Admin
                                                        <span className="bi bi-layout-wtf ms-2" aria-hidden="true" />
                                                    </Link>
                                                </li>
                                            )
                                        }
                                        <li className="dropdown-item">
                                            <button className="josylinhas-link link-primary" type="button" onClick={handleLogout} title="Sair">
                                                Logout
                                                <span className="bi bi-box-arrow-right ms-2" aria-hidden="true" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )
                        }

                    </ul>

                </div>
            </nav>
        </header>
    );
};

export default Header;