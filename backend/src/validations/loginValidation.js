import { isRequired, isEmail, maxLength } from "./validators.js";

export function normalizeLoginData(data) {
    return {
        email: data.email?.trim().toLowerCase(),
        password: data.password,
    };
}

export function validateLogin(data) {
    const errors = {};

    if (!isRequired(data.email)) {
        errors.email = "O campo e-mail é obrigatório.";
    } else if (!isEmail(data.email)) {
        errors.email = "Informe um e-mail válido.";
    } else if (!maxLength(data.email, 255)) {
        errors.email = "O e-mail informado é muito longo.";
    }

    if (!isRequired(data.password)) {
        errors.password = "O campo senha é obrigatório.";
    }

    return errors;
}