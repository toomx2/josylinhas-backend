import { isRequired, minLength, maxLength } from "./validators";

const allowedThumbnailTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const maxThumbnailSize = 5 * 1024 * 1024;

export function articleValidation(data, thumbnail) {
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

    if (thumbnail) {
        if (!allowedThumbnailTypes.includes(thumbnail.type)) {
            errors.thumbnail = "A thumbnail deve ser uma imagem JPG, PNG ou WEBP.";
        } else if (thumbnail.size > maxThumbnailSize) {
            errors.thumbnail = "A thumbnail deve ter no máximo 5 MB.";
        }
    }

    return errors;
}