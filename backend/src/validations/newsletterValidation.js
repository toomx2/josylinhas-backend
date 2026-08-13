import { isRequired, isEmail, maxLength } from "./validators.js";

export function normalizeNewsletterData(data) {
    return {
        email: data.email?.trim().toLowerCase()
    };
}

export function validateNewsletter(data) {
    const errors = {};

    if (!isRequired(data.email)) {
        errors.email = "O campo e-mail é obrigatório.";
    } else if (!isEmail(data.email)) {
        errors.email = "Informe um e-mail válido.";
    } else if (!maxLength(data.email, 255)) {
        errors.email = "O e-mail não pode ultrapassar 255 caracteres.";
    }

    return errors;
}