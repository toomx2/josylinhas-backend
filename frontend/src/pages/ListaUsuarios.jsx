import { Link } from "react-router-dom";

const ListaUsuarios = () => {

    const users = [
        {
            id: 1,
            name: "Amora Fernandes",
            email: "amora.dfernandes@gmail.com",
            active: true,
            role: "Admin",
            created_at: "28/06/2026",
        },

        {
            id: 2,
            name: "Luiz Eduardo",
            email: "luiz.esalbuquerque@gmail.com",
            active: true,
            role: "Admin",
            created_at: "28/06/2026",
        },

        {
            id: 3,
            name: "Mariana Prescinato",
            email: "mariana.sprescinato@gmail.com",
            active: true,
            role: "Admin",
            created_at: "28/06/2026",
        },

        {
            id: 4,
            name: "Victor Emanuel",
            email: "victor.esrocha@gmail.com",
            active: true,
            role: "Admin",
            created_at: "28/06/2026",
        },

        {
            id: 5,
            name: "Wecton Soares",
            email: "wecton.scarvalho@gmail.com",
            active: false,
            role: "Usuário",
            created_at: "28/06/2026",
        },
    ];

    function isAdmin(id) {
        const user = users.find(user => user.id === id);
        return user ? user.role === "Admin" : false;
    }

    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">
            <div className="container-fluid">
                <section className="card card-background my-3 p-3">

                    <h1 className="fs-3 fw-semibold text-center py-3">
                        Usuários
                    </h1>

                    <div className="container pb-5">
                        <form className="row align-center">
                            <div className="search-section">
                                <label className="visually-hidden" htmlFor="search">
                                    Pesquisar
                                </label>

                                <input className="form-control search-input"
                                       id="search"
                                       name="search"
                                       type="text"
                                       autoComplete="off"
                                       placeholder="Pesquisar" />

                                <button className="search-button" 
                                        type="submit"
                                        title="Pesquisar">

                                    <span className="bi bi-search" 
                                          aria-hidden="true"> </span>

                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="table-responsive">
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
                                {users.map((user) => (
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
                                            <span className={`badge ${isAdmin(user.id) ? "text-bg-warning" : "text-bg-primary"}`}>
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            {user.created_at}
                                        </td>

                                        <td>
                                            <span className={`badge ${user.active  ? "text-bg-success" : "text-bg-secondary"}`}>
                                                {user.active ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>

                                        <td>
                                            <button className="btn btn-danger" title="Bloquear">
                                                <span className="bi bi-ban" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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