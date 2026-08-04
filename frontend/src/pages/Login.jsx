import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import PasswordInput from "../components/PasswordInput";

import { loginValidation } from "../validations/loginValidation";

const Login = () => {

    const navigate = useNavigate();

    const initialData = {
        email: "",
        password: ""
    };

    const { login } = useAuth();

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

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
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = loginValidation(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {

            const payload = {
                email: formData.email,
                password: formData.password
            };

            const authUser = await login(payload);

            navigate(
                getRedirectPathByRole(authUser?.role),
                { replace: true }
            );

        } catch (error) {
            console.error("Erro na tentativa de login:", error);
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

                    <input className={`form-control ${errors.email ? "is-invalid" : ""}`}
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
                                   error={errors.password} />

                    <div className="text-end mt-1">
                        <Link className="form-link" to="/esqueci-senha">
                            Esqueci a Senha
                        </Link>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <button className="josylinhas-btn form-btn" type="submit">
                        Logar
                    </button>
                </div>

                <Link className="form-link" to="/cadastrar">
                    Cadastrar-se
                </Link>
            </form>
        </div>
    );

};

export default Login;