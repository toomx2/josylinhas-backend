import "./Footer.css";

import api from "../services/api";

import { useState } from "react";
import { Link } from "react-router-dom";

import { newsletterValidation } from "../validations/newsletterValidation";
import { showSuccess, showError, showWarning } from "../utilities/toast";

import JosylinhasLogo from "../assets/josylinhas-logo.png";

function Footer() {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const currentYear = new Date().getFullYear();

    async function handleNewsletter(event) {
        event.preventDefault();

        const validationErrors = newsletterValidation({ email });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showWarning("Verifique o e-mail informado.");
            return;
        }

        try {

            setLoading(true);
            setErrors({});

            const res = await api.post("/newsletter", {
                email
            });

            if (res.status === 201) {
                showSuccess(res.data.message);
                setEmail("");
            }

        } catch (error) {

            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 400 && data?.errors) {
                setErrors(data.errors);
                showWarning(data.message);
                return;
            }

            if (status === 409) {
                setErrors({
                    email: data?.message
                });
                showWarning(data?.message);
                return;
            }

            showError(data?.message || "Erro ao cadastrar e-mail.");

        } finally {
            setLoading(false);
        }
    }

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

                            <form onSubmit={handleNewsletter}>
                                <div className="input-group">

                                    <input className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                           id="email"
                                           name="email"
                                           type="email"
                                           placeholder="E-Mail"
                                           autoComplete="email"
                                           value={email}
                                           onChange={(event) => setEmail(event.target.value)} />

                                    <button className="josylinhas-btn btn-primary input-group-text"
                                            type="submit"
                                            disabled={loading}>
                                        <span className={loading ? "spinner-border spinner-border-sm" : "bi bi-envelope"}></span>
                                    </button>

                                </div>

                                {errors.email && (
                                    <p className="small text-danger mt-2 mb-0">
                                        {errors.email}
                                    </p>
                                )}
                            </form>

                        </div>

                    </div>

                </div>
            </div>

            <div className="copyright-section">
                <p>
                    Copyright &copy; {currentYear} Josylinhas. Todos os Direitos Reservados.
                </p>
            </div>

        </footer>
    );
}

export default Footer;