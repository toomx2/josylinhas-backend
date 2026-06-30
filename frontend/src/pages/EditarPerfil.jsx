import { Link } from "react-router-dom";

const EditarPerfil = () => {
    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2">

                <h1 className="form-title">
                    Editar Perfil
                </h1>

                <div>
                    <label className="form-label" htmlFor="name">
                        Nome Completo
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
                        E-Mail
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
                        Senha
                    </label>

                    <input className="form-control"
                           id="password"
                           name="password"
                           type="password"
                           autoComplete="new-password"
                           required />
                </div>

                <div>
                    <label className="form-label" htmlFor="confirm-password">
                        Confirmar Senha
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

                    <input className="form-control"
                           id="secret-question"
                           name="secretQuestion"
                           type="text"
                           disabled />
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