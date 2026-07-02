import { useState } from "react";
import { Link } from "react-router-dom";

import PasswordInput from "../components/PasswordInput";

import { resetPasswordValidation } from "../validations/resetPasswordValidation";

const AlterarSenha = () => {

    const initialData = {
        newPassword: "",
        repeatPassword: ""
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

        const validationErrors = resetPasswordValidation(formData);

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
                    Alterar Senha
                </h1>

                <PasswordInput label="Nova Senha *"
                               id="new-password"
                               name="newPassword"
                               autoComplete="new-password"
                               value={formData.newPassword}
                               onChange={handleChange}
                               error={errors.newPassword} />

                <PasswordInput label="Repetir Senha *"
                               id="repeat-password"
                               name="repeatPassword"
                               autoComplete="new-password"
                               value={formData.repeatPassword}
                               onChange={handleChange}
                               error={errors.repeatPassword} />

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