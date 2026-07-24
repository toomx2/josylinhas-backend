export function adminMiddleware(req, res, next) {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Usuário não autenticado."
        });
    }

    if (req.session.user.role !== "Admin") {
        return res.status(403).json({
            message: "Acesso negado."
        });
    }

    next();

}