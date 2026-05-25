import "./Header.css";

import { useState } from "react";

import JosylinhasLogo from "../assets/josylinhas-logo.png";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="josylinhas-header">
            <nav className="josylinhas-navbar">
                <div className="josylinhas-logo">
                    <a href="/">
                        <img className="josylinhas-logo"
                            src={JosylinhasLogo}
                            width="100"
                            height="100"
                            alt="Josylinhas Logotipo" />
                    </a>
                </div>

                <div className="josylinhas-menu">

                    <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="bi bi-list" aria-hidden="true"></span>
                    </div>

                    <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
                        <li>
                            <a className="josylinhas-link" href="#">
                                Home
                            </a>
                        </li>

                        <li>
                            <a className="josylinhas-link" href="#">
                                Produtos
                            </a>
                        </li>

                        <li>
                            <a className="josylinhas-link" href="#">
                                Blog
                            </a>
                        </li>

                        <li>
                            <a className="josylinhas-link" href="#">
                                Parcerias
                            </a>
                        </li>

                        <li>
                            <a className="josylinhas-link" href="#">
                                Sobre
                            </a>
                        </li>
                    </ul>

                </div>
            </nav>
        </header>
    );
};

export default Header;