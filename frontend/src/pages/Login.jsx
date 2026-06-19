import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2">

                <h1 className="form-title">
                    Login
                </h1>

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
                           autoComplete="current-password"
                           required />

                    <div className="text-end mt-1">
                        <Link className="form-link" to="#">
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