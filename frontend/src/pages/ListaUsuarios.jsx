import api from "../services/api";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const roles = {
    superAdmin: "SuperAdmin",
    admin: "Admin",
    user: "Usuário"
};

const userStatus = {
    active: "Ativo",
    blocked: "Bloqueado"
};

const ListaUsuarios = () => {

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [search, setSearch] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getUsers() {
        try {

            const res = await api.get("/admin/usuarios");

            if (res.data) {
                setUsers(res.data);
            }

        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        } finally {
            setLoading(false);
        }
    }

    async function getCurrentUser() {
        try {

            const res = await api.get("/me");

            if (res.data) {
                setCurrentUser(res.data.user);
            }

        } catch (error) {
            console.error("Erro ao identificar usuário logado.", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUsers();
        getCurrentUser();
    }, []);

    function canChangeStatus(targetUser) {
        if (!currentUser) {
            return false;
        }

        if (Number(targetUser.id) === Number(currentUser.id)) {
            return false;
        }

        if (targetUser.role === roles.superAdmin) {
            return false;
        }

        if (currentUser.role === roles.superAdmin) {
            return true;
        }

        if (currentUser.role === roles.admin &&
                targetUser.role === roles.user) {
            return true;
        }

        return false;
    }

    async function handleBlock(id) {
        try {

            setActionLoadingId(id);

            await api.patch(`/admin/usuarios/${id}/bloquear`);
            await getUsers();

        } catch (error) {
            console.error("Erro ao bloquear usuário:", error);
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleUnblock(id) {
        try {

            setActionLoadingId(id);

            await api.patch(`/admin/usuarios/${id}/desbloquear`);
            await getUsers();

        } catch (error) {
            console.error("Erro ao desbloquear usuário:", error);
        } finally {
            setActionLoadingId(null);
        }
    }

    function getRoleBadgeClass(role) {
        switch (role) {
            case roles.superAdmin:
                return "text-bg-dark";
            case roles.admin:
                return "text-bg-warning";
            case roles.user:
                return "text-bg-primary";
            default:
                return "text-bg-secondary";
        }
    }

    function getRoleLabel(role) {
        switch (role) {
            case roles.superAdmin:
                return "Josylinhas";
            case roles.admin:
                return "Admin";
            case roles.user:
                return "Usuário";
            default:
                return "Desconhecido";
        }
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case userStatus.active:
                return "text-bg-success";
            case userStatus.blocked:
                return "text-bg-danger";
            default:
                return "text-bg-light";
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case userStatus.active:
                return "Ativo";
            case userStatus.blocked:
                return "Bloqueado";
            default:
                return "Desconhecido";
        }
    }

    const filteredUsers = users.filter((user) => {

        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            return true;
        }

        return (
            (user.name || "").toLowerCase().includes(searchTerm) ||
            (user.email || "").toLowerCase().includes(searchTerm) ||
            getStatusLabel(user.status).toLowerCase().includes(searchTerm)
        );

    });

    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">
            <div className="container-fluid">
                <section className="card card-background my-3 p-3">

                    <h1 className="fs-3 fw-semibold text-center py-3">
                        Usuários
                    </h1>

                    <div className="container pb-5">
                        <form className="row align-center"
                              onSubmit={(event) => event.preventDefault()}>
                            <div className="search-section">
                                <label className="visually-hidden" htmlFor="search">
                                    Pesquisar
                                </label>

                                <input className="form-control"
                                       id="search"
                                       name="search"
                                       type="text"
                                       autoComplete="off"
                                       placeholder="Pesquisar"
                                       value={search}
                                       onChange={(event) => setSearch(event.target.value)} />
                            </div>
                        </form>
                    </div>

                    <div className="table-responsive">
                        {
                            loading ?
                            (
                                <p className="text-center py-4">
                                    Carregando Usuários...
                                </p>
                            ) : (
                                <table className="table table-striped table-hover p-3">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                ID
                                            </th>

                                            <th scope="col">
                                                Nome
                                            </th>

                                            <th scope="col">
                                                E-Mail
                                            </th>

                                            <th scope="col">
                                                Cargo
                                            </th>

                                            <th scope="col">
                                                Cadastro
                                            </th>

                                            <th scope="col">
                                                Status
                                            </th>

                                            <th scope="col">
                                                Gerenciar
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        {user.id}
                                                    </td>

                                                    <td>
                                                        {user.name}
                                                    </td>

                                                    <td>
                                                        {user.email}
                                                    </td>

                                                    <td>
                                                        <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                            {getRoleLabel(user.role)}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {user.created_at}
                                                    </td>

                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                                                            {getStatusLabel(user.status)}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {
                                                            canChangeStatus(user) && (
                                                                <button className={user.status === userStatus.active ? "btn btn-danger" : "btn btn-success"}
                                                                        type="button"
                                                                        onClick={() => user.status === userStatus.active ? handleBlock(user.id) : handleUnblock(user.id)}
                                                                        title={user.status === userStatus.active ? "Bloquear" : "Desbloquear"}
                                                                        disabled={actionLoadingId === user.id}>
                                                                    <span className={
                                                                            actionLoadingId === user.id
                                                                                ? "spinner-border spinner-border-sm"
                                                                                : user.status === userStatus.active
                                                                                    ? "bi bi-ban"
                                                                                    : "bi bi-unlock"
                                                                            }
                                                                          aria-hidden="true"
                                                                    />
                                                                </button>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="text-center text-muted py-4" colSpan="7">
                                                    Nenhum Usuário Encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>

                    <Link className="link-secondary small my-3" to="/admin">
                        Dashboard
                    </Link>

                </section>
            </div>
        </div>
    );

};

export default ListaUsuarios;