import { isRequired, minLength, hasNumber, hasLowerCase, hasUpperCase, hasSpecialCharacter, isEquals } from "./validators.js";

export function normalizeResetPasswordData(data) {
    return {
        token: data.token?.trim(),
        newPassword: data.newPassword,
        repeatPassword: data.repeatPassword
    };
}

export function validateResetPassword(data) {
    const errors = {};

    if (!isRequired(data.token)) {
        errors.token = "Token inválido ou inexistente. Repita o processo novamente.";
    }

    if (!isRequired(data.newPassword)) {
        errors.newPassword = "Por favor, insira uma nova senha.";
    } else if (!minLength(data.newPassword, 8)) {
        errors.newPassword = "A senha deve ter pelo menos oito caracteres.";
    } else if (!hasNumber(data.newPassword)) {
        errors.newPassword = "A senha deve conter pelo menos um número.";
    } else if (!hasLowerCase(data.newPassword)) {
        errors.newPassword = "A senha deve conter pelo menos uma letra minúscula.";
    } else if (!hasUpperCase(data.newPassword)) {
        errors.newPassword = "A senha deve conter pelo menos uma letra maiúscula.";
    } else if (!hasSpecialCharacter(data.newPassword)) {
        errors.newPassword = "A senha deve conter pelo menos um caractere especial.";
    }

    if (!isRequired(data.repeatPassword)) {
        errors.repeatPassword = "Por favor, confirme a senha.";
    } else if (!isEquals(data.repeatPassword, data.newPassword)) {
        errors.repeatPassword = "As senhas não correspondem.";
    }

    return errors;
}