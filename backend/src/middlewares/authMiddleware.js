import database from "../config/database.js";

export async function authMiddleware(req, res, next) {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Usuário não autenticado."
        });
    }

    const [users] = await database.query(
        `
            SELECT id, status
            FROM usuarios
            WHERE id = ?
            LIMIT 1
        `,
        [req.session.user.id]
    );

    if (users.length === 0) {
        req.session.destroy(() => {});

        return res.status(401).json({
            message: "Sessão inválida."
        });
    }

    const user = users[0];

    if (user.status === "Bloqueado") {
        return req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({
                    message: "Erro ao encerrar sessão."
                });
            }

            return res.status(403).json({
                message: "Usuário bloqueado."
            });
        });
    }

    next();

}