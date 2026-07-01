import { useState } from "react";

const PasswordInput = ({
    id,
    name,
    label,
    autoComplete,
    value,
    onChange,
    placeholder,
    minLength,
    required = false,
    error
}) => {

    const [showPassword, setShowPassword] = useState(false);
    const isInvalid = Boolean(error);

    return (
        <div>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <div className="josylinhas-password">

                <input className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                       id={id}
                       name={name}
                       type={showPassword ? "text" : "password"}
                       autoComplete={autoComplete}
                       value={value}
                       onChange={onChange}
                       placeholder={placeholder}
                       minLength={minLength}
                       required={required} />

                <button className={`password-toggle ${isInvalid ? "is-invalid" : ""}`}
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={showPassword ? "Ocultar Senha" : "Mostrar Senha"}
                        aria-pressed={showPassword}>
                    <span className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                </button>

            </div>

            {error &&
                <p className="text-danger small">
                    {error}
                </p>}
        </div>
    );
};

export default PasswordInput;