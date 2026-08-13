import api from "../services/api";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import ConfirmModal from "../components/ConfirmModal";

const articleStatus = {
    arquivado: "Arquivado",
    publicado: "Publicado",
    rascunho: "Rascunho"
};

const ListaArtigos = () => {

    const [articles, setArticles] = useState([]);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    async function getArticles() {
        try {
            const res = await api.get("/admin/artigos");
            setArticles(res.data);
        } catch (error) {
            console.error("Erro ao carregar artigos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getArticles();
    }, []);

    function openDeleteModal(article) {
        setArticleToDelete(article);
    }

    function closeDeleteModal() {
        if (deleting) {
            return;
        }
        setArticleToDelete(null);
    }

    async function handleDelete() {

        if (!articleToDelete) {
            return;
        }

        try {

            setDeleting(true);

            const res = await api.delete(`/admin/artigos/${articleToDelete.id}`);

            setArticles((prevArticles) =>
                prevArticles.filter(
                    (article) => article.id !== articleToDelete.id
                )
            );

            setArticleToDelete(null);

        } catch (error) {
            console.error("Erro ao excluir artigo:", error);
        } finally {
            setDeleting(false);
        }

    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case articleStatus.arquivado:
                return "text-bg-warning";
            case articleStatus.publicado:
                return "text-bg-success";
            case articleStatus.rascunho:
                return "text-bg-secondary";
            default:
                return "text-bg-light";
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case articleStatus.arquivado:
                return "Arquivado";
            case articleStatus.publicado:
                return "Publicado";
            case articleStatus.rascunho:
                return "Rascunho";
            default:
                return "Desconhecido";
        }
    }

    const filteredArticles = articles.filter((article) => {
        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            return true;
        }

        return (
            (article.title || "").toLowerCase().includes(searchTerm) ||
            (article.author || "").toLowerCase().includes(searchTerm) ||
            getStatusLabel(article.status).toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="container-fluid">
            <section className="card card-background my-3 p-3">

                <h1 className="fs-3 fw-semibold text-center py-3">
                    Artigos
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
                                   onChange={(event) =>
                                   setSearch(event.target.value)} />
                        </div>
                    </form>
                </div>

                <div className="d-flex justify-content-end pb-5">
                    <Link className="btn btn-success" to="/admin/artigos/novo" title="Adicionar">
                        <span className="bi bi-plus-circle" />
                    </Link>
                </div>

                <div className="table-responsive">
                    {
                        loading ?
                        (
                            <p className="text-center py-4">
                                Carregando Artigos...
                            </p>
                        ) : (
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
                                    {filteredArticles.length > 0 ? (
                                        filteredArticles.map((article) => (
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
                                                    <span className={`badge ${getStatusBadgeClass(article.status)}`}>
                                                        {getStatusLabel(article.status)}
                                                    </span>
                                                </td>

                                                <td>
                                                    {article.published_on || "—"}
                                                </td>

                                                <td>
                                                    {article.updated_at || "—"}
                                                </td>

                                                <td>
                                                    <Link className="btn btn-primary me-2 mb-2" to={`/admin/artigos/editar/${article.id}`} title="Editar">
                                                        <span className="bi bi-pencil-fill" />
                                                    </Link>

                                                    <button className="btn btn-danger mb-2"
                                                            onClick={() => openDeleteModal(article)}
                                                            title="Deletar">
                                                        <span className="bi bi-trash-fill" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="text-center text-muted py-4" colSpan="7">
                                                Nenhum Artigo Encontrado.
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

            <ConfirmModal
                show={!!articleToDelete}
                title="Excluir Artigo"
                message={
                    articleToDelete
                        ? `Tem certeza que deseja excluir o artigo "${articleToDelete.title}"? Essa ação não poderá ser desfeita.`
                        : ""
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                confirmVariant="danger"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={closeDeleteModal}
            />
        </div>
    );

};

export default ListaArtigos;