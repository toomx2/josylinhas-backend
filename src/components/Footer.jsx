import "./Footer.css";

import { Link } from "react-router-dom";

import JosylinhasLogo from "../assets/josylinhas-logo.png";

function Footer() {

    return (
        <footer className="josylinhas-footer">

            <div className="footer-main">
                <div className="row gap-3">

                    <div className="col-md">

                        <h1 className="footer-title">
                            Josylinhas
                        </h1>

                        <div className="footer-logo">
                            <img className="josylinhas-logo"
                                src={JosylinhasLogo}
                                width="120"
                                height="120"
                                alt="Josylinhas Logotipo" />
                        </div>

                        <p className="font-small text-muted">
                            Roupas artesanais feitas com carinho!
                        </p>

                        <div className="social-media">

                            <a className="social-icon" href="#">
                                <span className="bi bi-facebook"></span>
                            </a>

                            <a className="social-icon" href="#">
                                <span className="bi bi-instagram"></span>
                            </a>

                            <a className="social-icon" href="#">
                                <span className="bi bi-whatsapp"></span>
                            </a>

                        </div>

                    </div>

                    <div className="col-md">

                        <nav className="footer-nav">

                            <h1 className="footer-title">
                                Links
                            </h1>

                            <ul className="josylinhas-menu">
                                <li>
                                    <Link className="footer-link" to="/">
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <Link className="footer-link" to="/produtos">
                                        Produtos
                                    </Link>
                                </li>

                                <li>
                                    <Link className="footer-link" to="/blog">
                                        Blog
                                    </Link>
                                </li>

                                <li>
                                    <Link className="footer-link" to="/parcerias">
                                        Parcerias
                                    </Link>
                                </li>

                                <li>
                                    <Link className="footer-link" to="/sobre">
                                        Sobre
                                    </Link>
                                </li>
                            </ul>

                        </nav>

                    </div>

                    <div className="col-md">

                        <div className="footer-subscribe">

                            <h1 className="footer-title">
                                Inscreva-se!
                            </h1>

                            <p className="font-small text-muted">
                                Insira seu e-mail para receber notificações sobre novas postagens do blog!
                            </p>

                            <form>

                                <div className="input-group">

                                    <input
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="E-Mail"
                                    />

                                    <button
                                        className="josylinhas-btn btn-primary input-group-text"
                                        type="submit"
                                    >
                                        <span className="bi bi-envelope"></span>
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            </div>

            <div className="copyright-section">
                <p>
                    Copyright &copy; 2026 Josylinhas. Todos os Direitos Reservados.
                </p>
            </div>

        </footer>
    );
}

export default Footer;