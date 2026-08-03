import "./Header.css";

import { useState } from "react";
import { Link } from "react-router-dom";

import JosylinhasLogo from "../assets/josylinhas-logo.png";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

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
                    </ul>

                </div>
            </nav>
        </header>
    );
};

export default Header;