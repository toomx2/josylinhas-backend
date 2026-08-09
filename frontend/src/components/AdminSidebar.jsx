import "./AdminSidebar.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminSidebar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

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
        <aside className={`admin-sidebar ${isOpen ? "is-open" : "is-closed"}`}>

            <button className="sidebar-toggle"
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    aria-expanded={isOpen}>
                <span className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}
                      aria-hidden="true" />
            </button>

            <div className="sidebar-content">

                <h3 className="sidebar-title">
                    {isOpen && "Admin"}
                </h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Link className="sidebar-link" to="/admin" title="Painel">
                                <span className="bi bi-layout-wtf" />

                                {isOpen && (
                                    <span>
                                        Dashboard
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li>
                            <Link className="sidebar-link" to="/admin/artigos" title="Artigos">
                                <span className="bi bi-file-earmark-text" />

                                {isOpen && (
                                    <span>
                                        Artigos
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li>
                            <Link className="sidebar-link" to="/admin/usuarios" title="Usuários">
                                <span className="bi bi-people" />

                                {isOpen && (
                                    <span>
                                        Usuários
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li>
                            <Link className="sidebar-link" to="/editar-perfil" title="Editar Perfil">
                                <span className="bi bi-person" />

                                {isOpen && (
                                    <span>
                                        Editar Perfil
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li>
                            <Link className="sidebar-link" to="/" title="Home">
                                <span className="bi bi-house-fill" />

                                {isOpen && (
                                    <span>
                                        Home
                                    </span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <hr className="sidebar-divider" />

                <button className="sidebar-btn"
                        type="button"
                        onClick={handleLogout}
                        title="Sair">
                    <span className="bi bi-box-arrow-right" />

                    {isOpen && (
                        <span>
                            Logout
                        </span>
                    )}
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;