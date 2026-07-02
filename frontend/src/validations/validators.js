export function isRequired(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isEmail(value) {
    if (!isRequired(value)) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

export function isEquals(value, otherValue) {
    if (!isRequired(value)) return true;

    return value === otherValue;
}

export function minLength(value, min) {
    if (!isRequired(value)) return true;

    return String(value).trim().length >= min;
}

export function maxLength(value, max) {
    if (!isRequired(value)) return true;

    return String(value).trim().length <= max;
}

export function hasNumber(value) {
    if (!isRequired(value)) return true;

    return /\d/.test(value);
}

export function hasUpperCase(value) {
    if (!isRequired(value)) return true;

    return /[A-Z]/.test(value);
}

export function hasLowerCase(value) {
    if (!isRequired(value)) return true;

    return /[a-z]/.test(value);
}

export function hasSpecialCharacter(value) {
    if (!isRequired(value)) return true;

    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
}