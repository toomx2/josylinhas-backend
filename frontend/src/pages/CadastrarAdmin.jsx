import api from "../services/api";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";

import { registerValidation } from "../validations/registerValidation";
import { showSuccess, showError, showWarning } from "../utilities/toast";

const CadastrarAdmin = () => {

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
    const [loading, setLoading] = useState(false);

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
            showWarning("Corrija os campos destacados antes de continuar.");
            return;
        }

        try {

            setLoading(true);
            setErrors({});

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                secretQuestion: formData.secretQuestion,
                questionAnswer: formData.questionAnswer
            };

            const res = await api.post("/admin/usuarios", payload);

            if (res.status === 201) {
                showSuccess(res.data.message);
                setFormData(initialData);
                navigate("/login");
            }

        } catch (error) {

            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 400 && data?.errors) {
                setErrors(data.errors);
                showWarning(data.message);
                return;
            }

            if (status === 409) {
                setErrors(data.errors);
                showError(data?.message);
                return;
            }

            showError(data?.message ||
                "Erro ao conectar com o servidor"
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
                    Novo Admin
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
                    <button className="josylinhas-btn form-btn" 
                            type="submit"
                            disabled={loading}>
                        {loading ? "Salvando..." : "Cadastrar"}
                    </button>
                </div>

                <Link className="form-link" to="/admin/usuarios">
                    Cancelar
                </Link>
            </form>
        </div>
    );

};

export default CadastrarAdmin;