import { Link } from "react-router-dom";

const ListaArtigos = () => {

    const articles = [
        {
            id: 1,
            title: "Tendência Sustentável: Moda Reciclada em Alta",
            status: "Publicado",
            author: "Amora Fernandes",
            published_on: "10/05/2026",
            updated_at: "28/06/2026",
        },

        {
            id: 2,
            title: "Diversidade nas Passarelas: Moda Inclusiva Ganha Espaço",
            status: "Rascunho",
            author: "Victor Emanuel",
            published_on: null,
            updated_at: "28/06/2026",
        },

        {
            id: 3,
            title: "Figurinos Criativos Transformam o Carnaval em Arte",
            status: "Rascunho",
            author: "Mariana Prescinato",
            published_on: null,
            updated_at: "28/06/2026",
        },
    ];

    const statusMap = {
        "Arquivado": "text-bg-warning",
        "Publicado": "text-bg-success",
        "Rascunho": "text-bg-secondary"
    };

    function getStatus(status) {
        return statusMap[status] || "text-bg-primary";
    }

    return (
        <div className="container-fluid">
            <section className="card card-background my-3 p-3">

                <h1 className="fs-3 fw-semibold text-center py-3">
                    Artigos
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

                <div className="d-flex justify-content-end pb-5">
                    <Link className="btn btn-success" to="#" title="Adicionar">
                        <span className="bi bi-plus-circle" />
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover p-3">
                        <thead>
                            <tr>
                                <th scope="col">
                                    ID
                                </th>

                                <th scope="col">
                                    Título
                                </th>

                                <th scope="col">
                                    Autor
                                </th>

                                <th scope="col">
                                    Status
                                </th>

                                <th scope="col">
                                    Publicado Em
                                </th>

                                <th scope="col">
                                    Atualizado Em
                                </th>

                                <th scope="col">
                                    Gerenciar
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        {article.id}
                                    </td>

                                    <td>
                                        {article.title}
                                    </td>

                                    <td>
                                        {article.author}
                                    </td>

                                    <td>
                                        <span className={`badge ${getStatus(article.status)}`}>
                                            {article.status}
                                        </span>
                                    </td>

                                    <td>
                                        {article.published_on || "—"}
                                    </td>

                                    <td>
                                        {article.updated_at}
                                    </td>

                                    <td>
                                        <Link className="btn btn-primary me-2 mb-2" to="#" title="Editar">
                                            <span className="bi bi-pencil-fill" />
                                        </Link>

                                        <button className="btn btn-danger mb-2" title="Deletar">
                                            <span className="bi bi-trash-fill" />
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
    );

};

export default ListaArtigos;