import { isRequired, isEmail, minLength, hasNumber, hasLowerCase, hasUpperCase, hasSpecialCharacter, maxLength } from "./validators.js";

export function normalizeRegisterData(data) {
    return {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        password: data.password,
        secretQuestion: data.secretQuestion?.trim(),
        questionAnswer: data.questionAnswer?.trim()
    };
}

export function validateRegister(data) {
    const errors = {};

    if (!isRequired(data.name)) {
        errors.name = "O campo nome é obrigatório.";
    } else if (!minLength(data.name, 3)) {
        errors.name = "O nome deve ter pelo menos três caracteres.";
    } else if (!maxLength(data.name, 100)) {
        errors.name = "O nome não pode ultrapassar cem caracteres.";
    }

    if (!isRequired(data.email)) {
        errors.email = "O campo e-mail é obrigatório.";
    } else if (!isEmail(data.email)) {
        errors.email = "Informe um e-mail válido.";
    } else if (!maxLength(data.email, 255)) {
        errors.email = "O e-mail informado é muito longo.";
    }

    if (!isRequired(data.password)) {
        errors.password = "O campo senha é obrigatório.";
    } else if (!minLength(data.password, 8)) {
        errors.password = "A senha deve ter pelo menos oito caracteres.";
    } else if (!hasNumber(data.password)) {
        errors.password = "A senha deve conter pelo menos um número.";
    } else if (!hasLowerCase(data.password)) {
        errors.password = "A senha deve conter pelo menos uma letra minúscula.";
    } else if (!hasUpperCase(data.password)) {
        errors.password = "A senha deve conter pelo menos uma letra maiúscula.";
    } else if (!hasSpecialCharacter(data.password)) {
        errors.password = "A senha deve conter pelo menos um caractere especial.";
    }

    if (!isRequired(data.secretQuestion)) {
        errors.secretQuestion = "Por favor, selecione uma pergunta.";
    }

    if (!isRequired(data.questionAnswer)) {
        errors.questionAnswer = "O campo resposta secreta é obrigatório.";
    } else if (!minLength(data.questionAnswer, 3)) {
        errors.questionAnswer = "A resposta secreta deve ter pelo menos três caracteres.";
    }

    return errors;
}