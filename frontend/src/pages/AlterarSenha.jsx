import { Link } from "react-router-dom";

const AlterarSenha = () => {
    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2">

                <h1 className="form-title">
                    Alterar Senha
                </h1>

                <div>
                    <label className="form-label" htmlFor="new-password">
                        Nova Senha *
                    </label>

                    <input className="form-control"
                           id="new-password"
                           name="newPassword"
                           type="password"
                           autoComplete="new-password"
                           minLength="8"
                           required />
                </div>

                <div>
                    <label className="form-label" htmlFor="repeat-password">
                        Repetir Senha *
                    </label>

                    <input className="form-control"
                           id="repeat-password"
                           name="repeatPassword"
                           type="password"
                           autoComplete="new-password"
                           required />
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <button className="josylinhas-btn form-btn" type="submit">
                        Alterar
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