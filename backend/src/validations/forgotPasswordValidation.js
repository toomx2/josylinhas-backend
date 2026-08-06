import { isRequired, isEmail } from "./validators.js";

export function normalizeForgotPasswordData(data) {
    return {
        email: data.email?.trim().toLowerCase()
    };
}

export function validateForgotPassword(data) {
    const errors = {};

    if (!isRequired(data.email)) {
        errors.email = "O campo e-mail é obrigatório.";
    } else if (!isEmail(data.email)) {
        errors.email = "Informe um e-mail válido.";
    }

    return errors;
}