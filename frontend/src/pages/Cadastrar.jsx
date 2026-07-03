import axios from "axios";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";

import { registerValidation } from "../validations/registerValidation";

const Cadastrar = () => {

    const navigate = useNavigate();

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

    const secretQuestions = [
        "Nome da primeira escola que frequentou",
        "Seu apelido de infância que sua família usava",
        "Nome do primeiro animal de estimação",
        "Título do seu livro favorito",
        "Nome da primeira empresa onde trabalhou"
    ];

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

        const validationErrors = registerValidation(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                secretQuestion: formData.secretQuestion,
                questionAnswer: formData.questionAnswer
            };

            const res = await axios.post("http://localhost:5000/cadastrar-admin", payload);

            if (res.status === 201) {
                setFormData(initialData);
                navigate("/login");
            }

        } catch (error) {
            console.log("Ocorreu Um Erro:", error);
        }
    }

    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2"
                  onSubmit={handleSubmit}>

                <h1 className="form-title">
                    Cadastrar-se
                </h1>

                <div>
                    <label className="form-label" htmlFor="name">
                        Nome Completo *
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
                        E-Mail *
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

                <PasswordInput label="Senha *"
                               id="password"
                               name="password"
                               autoComplete="new-password"
                               value={formData.password}
                               onChange={handleChange}
                               error={errors.password} />

                <PasswordStrength password={formData.password} />

                <PasswordInput label="Confirmar Senha *"
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

                    <select className={`form-control ${errors.secretQuestion ? "is-invalid" : ""}`}
                            id="secret-question"
                            name="secretQuestion"
                            value={formData.secretQuestion}
                            onChange={handleChange}>

                        <option value="">
                            Selecione
                        </option>

                        {secretQuestions.map((question, index) => (
                            <option key={index} value={question}>
                                {question}
                            </option>
                        ))}

                    </select>

                    {errors.secretQuestion &&
                        <p className="small text-danger">
                            {errors.secretQuestion}
                        </p>}
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
                        Cadastrar-se
                    </button>
                </div>

                <Link className="form-link" to="/login">
                    Fazer Login
                </Link>
            </form>
        </div>
    );

};

export default Cadastrar;