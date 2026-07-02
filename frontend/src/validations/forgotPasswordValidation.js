import { isRequired, isEmail } from "./validators";

export function forgotPasswordValidation(data) {
    const errors = {};

    if (!isRequired(data.email)) {
        errors.email = "O campo e-mail é obrigatório.";
    } else if (!isEmail(data.email)) {
        errors.email = "Informe um e-mail válido.";
    }

    return errors;
}