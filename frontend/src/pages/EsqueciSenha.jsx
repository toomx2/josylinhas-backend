import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPasswordValidation } from "../validations/forgotPasswordValidation";

const EsqueciSenha = () => {

    const [formData, setFormData] = useState({
        email: ""
    });

    const [errors, setErrors] = useState({});

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

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = forgotPasswordValidation(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
    }

    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2"
                  onSubmit={handleSubmit}>

                <h1 className="form-title">
                    Esqueci a Senha
                </h1>

                <p className="text-muted small mb-3">
                    Sem problemas. Insira seu endereço de e-mail e enviaremos um link para criar uma nova senha.
                </p>

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

                <div className="d-flex justify-content-center mt-3">
                    <button className="josylinhas-btn form-btn" type="submit">
                        Enviar
                    </button>
                </div>

                <Link className="form-link" to="/login">
                    Login
                </Link>
            </form>
        </div>
    );

};

export default EsqueciSenha;