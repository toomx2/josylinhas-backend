import api from "../services/api";

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";

import { resetPasswordValidation } from "../validations/resetPasswordValidation";
import { showSuccess, showError, showWarning } from "../utilities/toast";

const AlterarSenha = () => {

    const navigate = useNavigate();

    const initialData = {
        newPassword: "",
        repeatPassword: ""
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { token } = useParams();

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

        const validationErrors = resetPasswordValidation(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showWarning("Corrija os campos destacados antes de continuar.");
            return;
        }

        try {

            setLoading(true);
            setErrors({});

            const res = await api.post(
                "/alterar-senha",
                {
                    token,
                    ...formData
                }
            );

            if (res.status === 200) {
                showSuccess(res.data.message);
                navigate("/login");
            }

        } catch (error) {

            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 400 && data?.errors) {
                setErrors(data.errors);

                showWarning(data.message ||
                    "Dados inválidos."
                );

                return;
            }

            showError(data?.message ||
                "Não foi possível alterar a senha."
            );

        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2"
                  onSubmit={handleSubmit}>

                <h1 className="form-title">
                    Alterar Senha
                </h1>

                <PasswordInput label="Nova Senha *"
                               id="new-password"
                               name="newPassword"
                               autoComplete="new-password"
                               value={formData.newPassword}
                               onChange={handleChange}
                               error={errors.newPassword} />

                <PasswordStrength password={formData.newPassword} />

                <PasswordInput label="Repetir Senha *"
                               id="repeat-password"
                               name="repeatPassword"
                               autoComplete="new-password"
                               value={formData.repeatPassword}
                               onChange={handleChange}
                               error={errors.repeatPassword} />

                <div className="d-flex justify-content-center mt-3">
                    <button className="josylinhas-btn form-btn"
                            type="submit"
                            disabled={loading}>
                        {loading ? "Alterando..." : "Alterar"}
                    </button>
                </div>

                <Link className="form-link" to="/login">
                    Cancelar
                </Link>
            </form>
        </div>
    );

};

export default AlterarSenha;