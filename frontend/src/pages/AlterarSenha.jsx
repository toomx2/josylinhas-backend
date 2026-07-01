import { Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";

const AlterarSenha = () => {
    return (
        <div className="admin-background d-flex flex-grow-1 justify-content-center align-items-center">

            <form className="form-card shadow my-3 mx-2">

                <h1 className="form-title">
                    Alterar Senha
                </h1>

                <PasswordInput label="Nova Senha *" id="new-password" name="newPassword" autoComplete="new-password" minLength={8} required />

                <PasswordInput label="Repetir Senha *" id="repeat-password" name="repeatPassword" autoComplete="new-password" required />

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