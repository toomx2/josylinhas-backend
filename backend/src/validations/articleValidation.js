import { isRequired, minLength, maxLength } from "./validators.js";

export function normalizeArticleData(data) {
    return {
        title: data.title?.trim(),
        resume: data.resume?.trim(),
        content: data.content?.trim(),
        categories: data.categories?.trim(),
        status: data.status?.trim()
    };
}

export function validateArticleData(data) {
    const errors = {};

    if (!isRequired(data.title)) {
        errors.title = "O campo título é obrigatório.";
    } else if (!minLength(data.title, 3)) {
        errors.title = "O título deve ter pelo menos três caracteres.";
    } else if (!maxLength(data.title, 255)) {
        errors.title = "O título excede o limite de caracteres (255).";
    }

    if (!isRequired(data.resume)) {
        errors.resume = "O campo resumo é obrigatório.";
    } else if (!maxLength(data.resume, 500)) {
        errors.resume = "O resumo excede o limite de caracteres (500).";
    }

    if (!isRequired(data.content)) {
        errors.content = "O campo conteúdo é obrigatório.";
    }

    if (!isRequired(data.status)) {
        errors.status = "O campo status é obrigatório.";
    } else if (!["Rascunho", "Publicado", "Arquivado"].includes(data.status)) {
        errors.status = "Status inválido.";
    }

    if (data.categories && !maxLength(data.categories, 255)) {
        errors.categories = "O campo categorias excede o limite de caracteres (255).";
    }

    return errors;
}