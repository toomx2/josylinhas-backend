import api from "../services/api";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";

import { profileValidation } from "../validations/profileValidation";
import { showSuccess, showError } from "../utilities/toast";

const EditarPerfil = () => {

    const initialData = {
        name: "",
        email: "",
        currentPassword: "",
        password: "",
        confirmPassword: ""
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    async function loadProfile() {
        try {
            setLoading(true);

            const res = await api.get("/perfil");

            setFormData((prev) => ({ ...prev,
                name: res.data.name || "",
                email: res.data.email || ""
            }));

        } catch (error) {
            showError("Não foi possível carregar os dados do perfil.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

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

        const validationErrors = profileValidation(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {

            setSaving(true);
            setErrors({});

            const res = await api.put("/perfil", {
                name: formData.name,
                email: formData.email,
                currentPassword: formData.currentPassword,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            showSuccess(res.data.message);

            setFormData((prev) => ({...prev,
                currentPassword: "",
                password: "",
                confirmPassword: ""
            }));

        } catch (error) {

            if (error.response?.status === 400) {
                setErrors(error.response.data.errors || {});
                showError(error.response.data.message);
                return;
            }

            showError("Não foi possível atualizar o perfil.");

        } finally {
            setSaving(false);
        }

    }

    if (loading) {
        return (
            <section className="container py-5 text-center">
                <p className="text-muted mb-0">
                    Carregando Perfil...
                </p>
            </section>
        );
    }

    return (
        <section className="admin-background d-flex justify-content-center align-items-center py-5">
            <form className="form-card shadow my-3 mx-2"
                  onSubmit={handleSubmit}>

                <h1 className="form-title">
                    Editar Perfil
                </h1>

                <hr className="mt-0" />

                <h2 className="fs-5 fw-semibold mb-3">
                    Dados Pessoais
                </h2>

                <div>
                    <label className="form-label" htmlFor="name">
                        Nome Completo *
                    </label>

                    <input className={`form-control ${errors.name ? "is-invalid" : ""}`}
                           id="name"
                           name="name"
                           type="text"
                           autoComplete="name"
                           value={formData.name}
                           onChange={handleChange} />

                    {errors.name && (
                        <div className="invalid-feedback">
                            {errors.name}
                        </div>
                    )}
                </div>

                <div>
                    <label className="form-label" htmlFor="email">
                        E-Mail *
                    </label>

                    <input className={`form-control ${errors.email ? "is-invalid" : ""}`}
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           value={formData.email}
                           onChange={handleChange} />

                    {errors.email && (
                        <div className="invalid-feedback">
                            {errors.email}
                        </div>
                    )}
                </div>

                <hr className="my-4" />

                <h2 className="fs-5 fw-semibold mb-3">
                    Alterar Senha
                </h2>

                <p className="text-muted small">
                    Preencha os campos abaixo apenas se desejar alterar sua senha.
                </p>

                <PasswordInput label="Senha Atual"
                               id="current-password"
                               name="currentPassword"
                               autoComplete="current-password"
                               value={formData.currentPassword}
                               onChange={handleChange}
                               error={errors.currentPassword} />

                <PasswordInput label="Nova Senha"
                               id="password"
                               name="password"
                               autoComplete="new-password"
                               value={formData.password}
                               onChange={handleChange}
                               error={errors.password} />

                <PasswordStrength password={formData.password} />

                <PasswordInput label="Confirmar Nova Senha"
                               id="confirm-password"
                               name="confirmPassword"
                               autoComplete="new-password"
                               value={formData.confirmPassword}
                               onChange={handleChange}
                               error={errors.confirmPassword} />

                <div className="d-flex justify-content-center mt-4">
                    <button className="josylinhas-btn form-btn"
                            type="submit"
                            disabled={saving}>
                        {saving ? "Salvando..." : "Salvar"}
                    </button>
                </div>

                <Link className="form-link" to="/">
                    Voltar
                </Link>
            </form>
        </section>
    );

};

export default EditarPerfil;