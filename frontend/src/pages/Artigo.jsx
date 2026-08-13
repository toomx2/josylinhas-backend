import "./Artigo.css";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { showError } from "../utilities/toast";

import imgExample from "../assets/image-example.png";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Artigo = () => {

    const { slug } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        loadArticle();
    }, [slug]);

    async function loadArticle() {
        try {

            setLoading(true);
            setNotFound(false);

            const res = await api.get(`/artigos/${slug}`);

            setArticle(res.data.article || []);

        } catch (error) {
            console.error("Erro ao carregar artigo:", error);

            setArticle(null);
            setNotFound(true);

            if (error.response?.status === 404) {
                showError("Artigo não encontrado.");
            } else {
                showError("Não foi possível carregar o artigo.");
            }

        } finally {
            setLoading(false);
        }
    }

    function getThumbnailUrl(thumbnail) {
        if (!thumbnail) {
            return imgExample;
        }

        return `${backendUrl}/uploads/articles/thumbnails/${thumbnail}`;
    }

    if (loading) {
        return (
            <section className="container py-5 text-center">
                <p className="text-muted mb-0">
                    Carregando artigo...
                </p>
            </section>
        );
    }

    if (notFound || !article) {
        return (
            <section className="container py-5 text-center">
                <h1 className="fs-4 fw-semibold mb-3">
                    Artigo não encontrado
                </h1>

                <p className="text-muted mb-4">
                    O artigo solicitado não está disponível ou foi removido.
                </p>

                <Link className="btn btn-primary" to="/blog">
                    Voltar Para o Blog
                </Link>
            </section>
        );
    }

    return (
        <article className="article-page container-fluid py-5">
            <header className="article-header text-center mx-auto mb-4">
                {article.categories && (
                    <span className="badge rounded-pill article-category mb-3">
                        {article.categories}
                    </span>
                )}

                <h1 className="display-5 fw-semibold mb-3">
                    {article.title}
                </h1>

                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 text-muted small">
                    {article.author && (
                        <span>
                            Por <strong>{article.author}</strong>
                        </span>
                    )}

                        <span>
                            &bull;
                        </span>

                    {article.published_on && (
                        <span>
                            Publicado Em: {article.published_on}
                        </span>
                    )}
                </div>
            </header>

            <div className="d-flex flex-column justify-content-center align-items-end mb-3 mb-md-5">
                <figure className="article-image-wrapper mb-3">
                    <img className="article-image" src={getThumbnailUrl(article.thumbnail)} alt={`Imagem do artigo ${article.title}`} />
                </figure>
            </div>

            <section className="article-content mx-auto">
                {article.content}
            </section>

            <div className="d-flex justify-content-center mt-5">
                <Link className="josylinhas-btn btn-primary p-2 px-5" to="/blog">
                    Voltar
                </Link>
            </div>
        </article>
    );

};

export default Artigo;