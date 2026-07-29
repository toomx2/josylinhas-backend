export function adminMiddleware(req, res, next) {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Usuário não autenticado."
        });
    }

    const allowedRoles = ["SuperAdmin", "Admin"];

    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({
            message: "Acesso negado."
        });
    }

    next();

}