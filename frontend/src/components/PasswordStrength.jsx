import { validatePasswordStrength } from "../utilities/passwordStrength";

function PasswordStrength({ password }) {

    if (!password) {
        return null;
    }

    const strength = validatePasswordStrength(password);


    const passwordStrengthClasses = {
        Fraca: "weak",
        Média: "medium",
        Forte: "strong"
    };

    const levelClass = passwordStrengthClasses[strength.level];

    return (
        <section>
            <div className="password-strength" aria-hidden="true">
                <div className={`strength-bar strength-bar-${levelClass}`} />
            </div>

            <p className="password-status">
                Senha {strength.level}
            </p>
        </section>
    );

}

export default PasswordStrength;