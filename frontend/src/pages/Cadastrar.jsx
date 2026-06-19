import { Link } from "react-router-dom";

const Cadastrar = () => {

    const secretQuestions = [
        "Nome da primeira escola que frequentou",
        "Seu apelido de infância que sua família usava",
        "Nome do primeiro animal de estimação",
        "Título do seu livro favorito",
        "Nome da primeira empresa onde trabalhou"
    ];

    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2" method="POST">

                <h1 className="form-title">
                    Cadastrar-se
                </h1>

                <div>
                    <label className="form-label" htmlFor="name">
                        Nome Completo *
                    </label>

                    <input className="form-control"
                           id="name"
                           name="name"
                           type="text"
                           autoComplete="username"
                           required />
                </div>

                <div>
                    <label className="form-label" htmlFor="email">
                        E-Mail *
                    </label>

                    <input className="form-control"
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required />
                </div>

                <div>
                    <label className="form-label" htmlFor="password">
                        Senha *
                    </label>

                    <input className="form-control"
                           id="password"
                           name="password"
                           type="password"
                           autoComplete="new-password"
                           minLength="8"
                           required />
                </div>

                <div>
                    <label className="form-label" htmlFor="confirm-password">
                        Confirmar Senha *
                    </label>

                    <input className="form-control"
                           id="confirm-password"
                           name="confirmPassword"
                           type="password"
                           autoComplete="new-password"
                           required />
                </div>

                <div>
                    <label className="form-label" htmlFor="secret-question">
                        Pergunta Secreta
                    </label>

                    <select className="form-select"
                            id="secret-question"
                            name="secretQuestion"
                            required>

                        <option value="">
                            Selecione
                        </option>

                        {secretQuestions.map((question, index) => (
                            <option key={index} value={question}>
                                {question}
                            </option>
                        ))}

                    </select>
                </div>

                <div>
                    <label className="form-label" htmlFor="question-answer">
                        Resposta Secreta *
                    </label>

                    <input className="form-control"
                           id="question-answer"
                           name="questionAnswer"
                           type="text"
                           required />
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