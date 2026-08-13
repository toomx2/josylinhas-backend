import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import PasswordInput from "../components/PasswordInput";

import { loginValidation } from "../validations/loginValidation";
import { showSuccess, showError, showWarning } from "../utilities/toast";

const Login = () => {

    const navigate = useNavigate();

    const initialData = {
        email: "",
        password: ""
    };

    const { login } = useAuth();

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");
    const [loading, setLoading] = useState(false);

    const hasAuthError = Boolean(authError);

    function getRedirectPathByRole(role) {
        const adminRoles = ["Admin", "SuperAdmin"];

        return adminRoles.includes(role) ? "/admin" : "/";
    }

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

        setAuthError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setAuthError("");

        const validationErrors = loginValidation(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showWarning("Corrija os campos destacados antes de continuar.");
            return;
        }

        try {

            setLoading(true);
            setErrors({});

            const payload = {
                email: formData.email,
                password: formData.password
            };

            const authUser = await login(payload);

            showSuccess("Login realizado com sucesso!");

            navigate(
                getRedirectPathByRole(authUser?.role),
                { replace: true }
            );

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

            if (status === 401) {
                const message = data?.message || "E-mail ou senha inválidos.";
                setAuthError(message);
                showError(message);
                return;
            }

            if (status === 403) {
                showError(data?.message ||
                    "Usuário sem permissão para acessar."
                );
                return;
            }

            showError(data?.message ||
                "Erro ao conectar com o servidor."
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
                    Login
                </h1>

                <div>
                    <label className="form-label" htmlFor="email">
                        E-Mail
                    </label>

                    <input className={`form-control ${errors.email || hasAuthError ? "is-invalid" : ""}`}
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           value={formData.email}
                           onChange={handleChange} />

                    {errors.email &&
                        <p className="small text-danger">
                            {errors.email}
                        </p>}
                </div>

                <div>
                    <PasswordInput label="Senha" 
                                   id="password"
                                   name="password"
                                   autoComplete="current-password"
                                   value={formData.password}
                                   onChange={handleChange}
                                   error={errors.password || authError} />

                    <div className="text-end mt-1">
                        <Link className="form-link" to="/esqueci-senha">
                            Esqueci a Senha
                        </Link>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <button className="josylinhas-btn form-btn"
                            type="submit"
                            disabled={loading}>
                        {loading ? "Entrando..." : "Logar"}
                    </button>
                </div>

            </form>
        </div>
    );

};

export default Login;