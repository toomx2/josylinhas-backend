import { useState } from "react";
import { Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";

import { profileValidation } from "../validations/profileValidation";

const EditarPerfil = () => {

    const initialData = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        secretQuestion: "",
        questionAnswer: ""
    };

    const [formData, setFormData] = useState(initialData);
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

        const validationErrors = profileValidation(formData);

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
                    Editar Perfil
                </h1>

                <div>
                    <label className="form-label" htmlFor="name">
                        Nome Completo
                    </label>

                    <input className={`form-control ${errors.name ? "is-invalid" : ""}`}
                           id="name"
                           name="name"
                           type="text"
                           autoComplete="username"
                           value={formData.name}
                           onChange={handleChange} />

                    {errors.name &&
                        <p className="small text-danger">
                            {errors.name}
                        </p>}
                </div>

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

                <PasswordInput label="Senha"
                               id="password"
                               name="password"
                               autoComplete="new-password"
                               value={formData.password}
                               onChange={handleChange}
                               error={errors.password} />

                <PasswordInput label="Confirmar Senha"
                               id="confirm-password"
                               name="confirmPassword"
                               autoComplete="new-password"
                               value={formData.confirmPassword}
                               onChange={handleChange}
                               error={errors.confirmPassword} />

                <div>
                    <label className="form-label" htmlFor="secret-question">
                        Pergunta Secreta
                    </label>

                    <input className="form-control"
                           id="secret-question"
                           name="secretQuestion"
                           type="text"
                           value={formData.secretQuestion}
                           onChange={handleChange}
                           disabled />
                </div>

                <div>
                    <label className="form-label" htmlFor="question-answer">
                        Resposta Secreta *
                    </label>

                    <input className={`form-control ${errors.questionAnswer ? "is-invalid" : ""}`}
                           id="question-answer"
                           name="questionAnswer"
                           type="text"
                           value={formData.questionAnswer}
                           onChange={handleChange} />

                    {errors.questionAnswer &&
                        <p className="small text-danger">
                            {errors.questionAnswer}
                        </p>}
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <button className="josylinhas-btn form-btn" type="submit">
                        Salvar
                    </button>
                </div>

                <Link className="form-link" to="#">
                    Dashboard
                </Link>
            </form>
        </div>
    );

};

export default EditarPerfil;