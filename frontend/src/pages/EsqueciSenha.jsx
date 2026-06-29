import { Link } from "react-router-dom";

const EsqueciSenha = () => {
    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2">

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

                    <input className="form-control"
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required />
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