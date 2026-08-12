import { toast } from "react-toastify";

export function showSuccess(message) {
    toast.success(message || "Operação realizada com sucesso.");
}

export function showError(message) {
    toast.error(message || "Não foi possível realizar a operação.");
}

export function showWarning(message) {
    toast.warning(message || "Verifique as informações e tente novamente.");
}

export function showInfo(message) {
    toast.info(message || "Informação importante.");
}