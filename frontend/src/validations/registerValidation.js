import { isRequired, isEmail, minLength, hasNumber, hasLowerCase, hasUpperCase, hasSpecialCharacter, isEquals } from "./validators";

export function registerValidation(data) {
    const errors = {};

    if (!isRequired(data.name)) {
        errors.name = "O campo nome é obrigatório.";
    }

    if (!isRequired(data.email)) {
        errors.email = "O campo e-mail é obrigatório.";
    } else if (!isEmail(data.email)) {
        errors.email = "Informe um e-mail válido.";
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

    if (!isRequired(data.confirmPassword)) {
        errors.confirmPassword = "Por favor, confirme a senha.";
    } else if (!isEquals(data.confirmPassword, data.password)) {
        errors.confirmPassword = "As senhas não correspondem.";
    }

    return errors;
}