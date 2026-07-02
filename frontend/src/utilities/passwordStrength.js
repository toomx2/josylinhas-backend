export function validatePasswordStrength(password = "") {
    const value = String(password);

    let strengthPoints = 0;

    if (value.length >= 8) strengthPoints++;

    if (/[A-Z]/.test(value)) strengthPoints++;
    if (/[a-z]/.test(value)) strengthPoints++;
    if (/\d/.test(value)) strengthPoints++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strengthPoints++;

    if (strengthPoints <= 2) {
        return { level: "Fraca", score: strengthPoints };
    }

    if (strengthPoints <= 4) {
        return { level: "Média", score: strengthPoints };
    }

    return { level: "Forte", score: strengthPoints };
}