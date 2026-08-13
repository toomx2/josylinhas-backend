import api from "../services/api";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { articleValidation } from "../validations/articleValidation";

const initialData = {
    title: "",
    resume: "",
    content: "",
    categories: "",
    status: "Rascunho"
};

const FormArtigo = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialData);
    const [thumbnail, setThumbnail] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const isEditing = Boolean(id);

    useEffect(() => {
        async function loadArticle() {

            if (!isEditing) {
                return;
            }

            try {

                setLoading(true);

                const res = await api.get(`/admin/artigos/${id}`);
                const article = res.data.article;

                const payload = {
                    title: article.title || "",
                    resume: article.resume || "",
                    content: article.content || "",
                    categories: article.categories || "",
                    status: article.status || "Rascunho"
                };

                setFormData(payload);

            } catch (error) {
                console.error("Erro ao carregar artigo:", error);
            } finally {
                setLoading(false);
            }
        }
        loadArticle();
    }, [id, isEditing]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = articleValidation(formData, thumbnail);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setErrors({});
            setLoading(true);

            const payload = new FormData();

            payload.append("title", formData.title);
            payload.append("resume", formData.resume);
            payload.append("content", formData.content);
            payload.append("categories", formData.categories);
            payload.append("status", formData.status);

            if (thumbnail) {
                payload.append("thumbnail", thumbnail);
            }

            if (isEditing) {
                await api.put(`/admin/artigos/${id}`, payload, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                await api.post("/admin/artigos", payload, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            navigate("/admin/artigos");

        } catch (error) {
            if (error.response?.status === 400) {
                setErrors(error.response.data.errors || {});
                return;
            }
            console.error("Erro ao salvar artigo:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleThumbnailChange(event) {
        const file = event.target.files[0];

        setThumbnail(file || null);

        setErrors((prev) => ({
            ...prev,
            thumbnail: ""
        }));
    }

    return (
        <div className="d-flex justify-content-center flex-grow-1">
            <form className="form-card shadow my-3 mx-2" onSubmit={handleSubmit}>

                <h1 className="form-title">
                    {isEditing ? "Editar Artigo" : "Novo Artigo"}
                </h1>

                <div>
                    <label className="form-label" htmlFor="title">
                        Título *
                    </label>

                    <input className={`form-control ${errors.title ? "is-invalid" : ""}`}
                           id="title"
                           name="title"
                           type="text"
                           value={formData.title}
                           onChange={handleChange} />

                    {errors.title && (
                        <div className="invalid-feedback">
                            {errors.title}
                        </div>
                    )}
                </div>

                <div>
                    <label className="form-label" htmlFor="thumbnail">
                        Thumbnail
                    </label>

                    <input className={`form-control ${errors.thumbnail ? "is-invalid" : ""}`}
                           id="thumbnail"
                           name="thumbnail"
                           type="file"
                           accept="image/*"
                           onChange={handleThumbnailChange} />
                </div>

                <div>
                    <label className="form-label" htmlFor="resume">
                        Resumo *
                    </label>

                    <textarea className={`form-control ${errors.resume ? "is-invalid" : ""}`}
                              id="resume"
                              name="resume"
                              rows="3"
                              value={formData.resume}
                              onChange={handleChange} />

                    {errors.resume && (
                        <div className="invalid-feedback">
                            {errors.resume}
                        </div>
                    )}
                </div>

                <div>
                    <label className="form-label" htmlFor="content">
                        Conteúdo *
                    </label>

                    <textarea className={`form-control ${errors.content ? "is-invalid" : ""}`}
                              id="content"
                              name="content"
                              rows="8"
                              value={formData.content}
                              onChange={handleChange} />

                    {errors.content && (
                        <div className="invalid-feedback">
                            {errors.content}
                        </div>
                    )}
                </div>

                <div>
                    <label className="form-label" htmlFor="categories">
                        Categorias
                    </label>

                    <textarea className={`form-control ${errors.categories ? "is-invalid" : ""}`}
                              id="categories"
                              name="categories"
                              value={formData.categories}
                              onChange={handleChange} />

                    {errors.categories && (
                        <div className="invalid-feedback">
                            {errors.categories}
                        </div>
                    )}
                </div>

                <div>
                    <label className="form-label" htmlFor="status">
                        Status *
                    </label>

                    <select className={`form-select ${errors.status ? "is-invalid" : ""}`}
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}>
                        <option value="Arquivado">
                            Arquivado
                        </option>

                        <option value="Publicado">
                            Publicado
                        </option>

                        <option value="Rascunho">
                            Rascunho
                        </option>
                    </select>

                    {errors.status && (
                        <div className="invalid-feedback">
                            {errors.status}
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-success"
                            type="submit"
                            disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>

                <Link className="link-secondary small my-3" to="/admin/artigos">
                    Cancelar
                </Link>
            </form>
        </div>
    );
};

export default FormArtigo;