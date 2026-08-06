import express from "express";
import cors from "cors";
import session from "express-session";
import mysqlSession from "express-mysql-session";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import database from "./config/database.js";

import { authMiddleware } from "./middlewares/authMiddleware.js";
import { adminMiddleware } from "./middlewares/adminMiddleware.js";

import { validateRegister, normalizeRegisterData } from "./validations/registerValidation.js";
import { validateLogin, normalizeLoginData } from "./validations/loginValidation.js";
import { validateForgotPassword, normalizeForgotPasswordData } from "./validations/forgotPasswordValidation.js";
import { validateResetPassword, normalizeResetPasswordData } from "./validations/resetPasswordValidation.js";

dotenv.config();

const app = express();
const storeSession = mysqlSession(session);

const frontEndUrl = (process.env.APP_URL || "http://localhost:5173").replace(/\/$/, "");
const port = process.env.PORT || 5000;

const isProduction = process.env.APP_ENV === "production"

const sessionStore = new storeSession({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    createDatabaseTable: true,

    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "id",
            expires: "expires",
            data: "payload"
        }
    }
});

app.use(cors({
    origin: frontEndUrl,
    credentials: true
}));
app.use(express.json());
app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 2
    }
}));

app.get("/", (req, res) => {
    res.send("Servidor Rodando...");
});

app.get("/admin/usuarios",
        authMiddleware,
        adminMiddleware,
        async (req, res) => {

    try {

        const sql =
            `
            SELECT id, 
                  nome AS name,
                  email,
                  cargo AS role,
                  status,
                  criado_em AS created_at
            FROM usuarios;
        `;

        const [rows] = await database.execute(sql);

        const dateTime = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const users = rows.map(user => {
            if (user.created_at) {
                const createdAt = new Date(user.created_at);
                user.created_at = dateTime.format(createdAt);
            }
            return user;
        });

        return res.status(201).json(users);

    } catch (error) {
        console.error("Erro ao buscar usuários no banco:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.patch("/admin/usuarios/:id/bloquear",
        authMiddleware,
        adminMiddleware,
        async (req, res) => {

    try {

        const targetUserId = req.params.id;
        const targetUserRole = targetUserId.role;
        const loggedInAdminId = req.session.user.id;
        const loggedInAdminRole = req.session.user.role;

        if (!targetUserId || isNaN(Number(targetUserId))) {
            return res.status(400).json({
                message: "ID de usuário inválido."
            });
        }

        if (Number(targetUserId) === Number(loggedInAdminId)) {
            return res.status(400).json({
                message: "Você não pode bloquear a si mesmo."
            });
        }

        const [users] = await database.query(
            `
                SELECT id,
                       nome AS name,
                       email,
                       cargo AS role,
                       status
                FROM usuarios
                WHERE id = ?
                LIMIT 1
            `,
            [targetUserId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        const targetUser = users[0];

        if (targetUser.status === "Bloqueado") {
            return res.status(400).json({
                message: "Usuário já está bloqueado."
            });
        }

        const canBlock = (loggedInAdminRole === "SuperAdmin" &&
                ["Admin", "Usuário"].includes(targetUser.role)) || 
                    (loggedInAdminRole === "Admin" && targetUser.role === "Usuário");

        if (!canBlock) {
            return res.status(403).json({
                message: "Você não tem permissão para bloquear este usuário."
            });
        }

        await database.query(
            `
                UPDATE usuarios
                SET status = ?,
                    bloqueado_em = NOW(),
                    bloqueado_por = ?
                WHERE id = ?
            `,
            ["Bloqueado", loggedInAdminId, targetUserId]
        );

        return res.status(200).json({
            message: "Usuário bloqueado com sucesso."
        });

    } catch (error) {
        console.error("Erro ao bloquear usuário:", error);

        return res.status(500).json({
            message: "Erro interno ao bloquear usuário."
        });
    }

});

app.patch("/admin/usuarios/:id/desbloquear",
        authMiddleware,
        adminMiddleware,
        async (req, res) => {

    try {

        const targetUserId = req.params.id;
        const loggedInAdminId = req.session.user.id;
        const loggedInAdminRole = req.session.user.role;

        if (!targetUserId || isNaN(Number(targetUserId))) {
            return res.status(400).json({
                message: "ID de usuário inválido."
            });
        }

        if (Number(targetUserId) === Number(loggedInAdminId)) {
            return res.status(400).json({
                message: "Você não pode desbloquear a si mesmo por esta rota."
            });
        }

        const [users] = await database.query(
            `
                SELECT id,
                       nome AS name,
                       email,
                       cargo as role,
                       status
                FROM usuarios
                WHERE id = ?
                LIMIT 1
            `,
            [targetUserId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        const targetUser = users[0];

        if (targetUser.status === "Ativo") {
            return res.status(400).json({
                message: "Usuário já está ativo."
            });
        }

        if (targetUser.role === "SuperAdmin") {
            return res.status(403).json({
                message: "Não é permitido alterar o status de um SuperAdmin."
            });
        }

        if (loggedInAdminRole === "Admin" && targetUser.role !== "Usuário") {
            return res.status(403).json({
                message: "Administradores só podem desbloquear usuários comuns."
            });
        }

        await database.query(
            `
                UPDATE usuarios
                SET status = ?,
                    bloqueado_em = NULL,
                    bloqueado_por = NULL
                WHERE id = ?
            `,
            ["Ativo", targetUserId]
        );

        return res.status(200).json({
            message: "Usuário desbloqueado com sucesso."
        });

    } catch (error) {
        console.error("Erro ao desbloquear usuário:", error);

        return res.status(500).json({
            message: "Erro interno ao desbloquear usuário."
        });
    }

});

app.post("/cadastrar-admin",
        authMiddleware,
        adminMiddleware, 
        async (req, res) => {

    try {

        const payload = normalizeRegisterData(req.body);
        const errors = validateRegister(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        const [existingUsers] = await database.execute(
            `
                SELECT id
                FROM usuarios
                WHERE email = ?
                LIMIT 1
            `,
            [payload.email]
        );

        if(existingUsers.length > 0) {
            return res.status(409).json({
                message: "Este e-mail já está cadastrado."
            });
        }

        const encryptedPassword = await bcrypt.hash(payload.password, 10);
        const encryptedAnswer = await bcrypt.hash(payload.questionAnswer, 10);

        const sql =
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha,
                pergunta_secreta,
                resposta_secreta,
                cargo
            )
            VALUES (
                ?, ?, ?, ?, ?, ?
            );
        `;

        await database.execute(sql, [
            payload.name,
            payload.email,
            encryptedPassword,
            payload.secretQuestion,
            encryptedAnswer,
            "Admin"
        ]);

        return res.status(201).json({
            message: "Administrador cadastrado com sucesso!"
        });

    } catch (error) {

        console.error("Erro na tentativa de cadastro:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });

    }

});

app.post("/login", async (req, res) => {

    try {

        const payload = normalizeLoginData(req.body);
        const errors = validateLogin(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        const [rows] = await database.query(
            `
                SELECT id, email, senha AS password, cargo AS role, status
                FROM usuarios
                WHERE email = ?
                LIMIT 1
            `,
            [payload.email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos."
            });
        }

        const users = rows[0];

        const validPassword = await bcrypt.compare(payload.password, users.password)
    
        if (!validPassword) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos."
            });
        }

        if (users.status === "Bloqueado") {
            return res.status(403).json({
                message: "Usuário bloqueado. Entre em contato com o suporte."
            });
        }

        req.session.user = {
            id: users.id,
            email: users.email,
            role: users.role
        };

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            user: {
                id: users.id,
                email: users.email,
                role: users.role
            }
        });

    } catch (error) {

        console.error("Erro na tentativa de login:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });

    }

});

app.get("/me", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            authenticated: false,
            message: "Usuário não autenticado."
        });
    }

    return res.status(200).json({
        authenticated: true,
        user: req.session.user
    });

});

app.post("/logout", (req, res) => {

    if (!req.session) {
        return res.status(200).json({
            message: "Nenhuma sessão ativa."
        });
    }

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                message: "Erro ao encerrar sessão.",
            });
        }

        res.clearCookie("sid");

        return res.status(200).json({
            message: "Logout realizado com sucesso!"
        });

    });

});

app.post("/esqueci-senha", async (req, res) => {

    try {

        const payload = normalizeForgotPasswordData(req.body);
        const errors = validateForgotPassword(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        const successMessage = {
            message: "Se o e-mail existir, enviaremos o passo a passo para redefinir sua senha."
        };

        const [users] = await database.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [payload.email]
        );

        if (!users.length) {
            return res.status(200).json(successMessage);
        }

        const user = users[0];

        const token = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

        const expiration = new Date(Date.now() + 1000 * 60 * 60);

        const sql =
            `
            INSERT INTO reset_tokens
            (
                usuario_id,
                token_hash,
                expira_em,
                criado_em
            )
            VALUES (
                ?, ?, ?, NOW()
            );
        `;

        await database.query(
            sql, [user.id, hashedToken, expiration]
        );

        const resetLink = `${process.env.APP_URL}/alterar-senha/${token}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: process.env.EMAIL_TLS_REJECT === "true"
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: payload.email,
            subject: "Recuperar Senha",
            html:
                `
                <p>
                    Você solicitou a redefinição de senha.
                </p>

                <p>
                    Clique no link abaixo para criar uma nova senha:
                </p>

                <a href="${resetLink}">
                    Clique aqui para redefinir sua senha!
                </a>

                <p>
                    Se você não solicitou essa alteração, ignore este e-mail.
                </p>
            `
        });

        return res.status(200).json(successMessage);

    } catch (error) {
        console.error("Erro na tentativa de envio do token:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.post("/alterar-senha", async (req, res) => {

    try {

        const payload = normalizeResetPasswordData(req.body);
        const errors = validateResetPassword(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        const hashedToken = crypto
                .createHash("sha256")
                .update(payload.token)
                .digest("hex");

        const [tokens] = await database.query(
            `
                SELECT id, usuario_id
                FROM reset_tokens
                WHERE token_hash = ?
                  AND expira_em > NOW()
                  AND usado_em IS NULL
                LIMIT 1
            `,
            [hashedToken]
        );

        if (!tokens.length) {
            return res.status(400).json({
                message: "Token inválido ou expirado."
            });
        }

        const resetToken = tokens[0];

        const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

        await database.query(
            `
                UPDATE usuarios
                SET senha = ?
                WHERE id = ?
            `,
            [hashedPassword, resetToken.usuario_id]
        );

        await database.query(
            `
                UPDATE reset_tokens
                SET usado_em = NOW()
                WHERE id = ?
            `,
            [resetToken.id]
        );

        return res.status(200).json({
            message: "Senha alterada com sucesso."
        });

    } catch (error) {
        console.error("Erro ao alterar senha:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.listen(port, () => {
    console.log("Servidor Rodando...");
    console.log("Porta:", port);
});