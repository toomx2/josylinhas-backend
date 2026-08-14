import express from "express";
import cors from "cors";
import session from "express-session";
import mysqlSession from "express-mysql-session";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import multer from "multer";

import database from "./config/database.js";

import { authMiddleware } from "./middlewares/authMiddleware.js";
import { adminMiddleware } from "./middlewares/adminMiddleware.js";
import uploadArticleThumbnail from "./middlewares/uploadArticleThumbnail.js";

import { validateArticleData, normalizeArticleData } from "./validations/articleValidation.js";

import { validateRegister, normalizeRegisterData } from "./validations/registerValidation.js";
import { validateLogin, normalizeLoginData } from "./validations/loginValidation.js";
import { validateForgotPassword, normalizeForgotPasswordData } from "./validations/forgotPasswordValidation.js";
import { validateResetPassword, normalizeResetPasswordData } from "./validations/resetPasswordValidation.js";

import { validateProfileData, normalizeProfileData } from "./validations/profileValidation.js";

import { validateNewsletter, normalizeNewsletterData } from "./validations/newsletterValidation.js";
import { sendWelcomeEmail } from "./services/newsletterService.js";

import { generateSlug } from "./utilities/generateSlug.js";

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
app.use("/uploads", express.static("uploads"));

async function deleteArticleThumbnail(filename) {
    if (!filename) {
        return;
    }

    try {
        const safeFilename = path.basename(filename);

        const filePath = path.join(
            process.cwd(),
            "uploads",
            "articles",
            "thumbnails",
            safeFilename
        );

        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Erro ao remover thumbnail antiga:", error);
        }
    }
}

app.get("/", (req, res) => {
    res.send("Servidor Rodando...");
});

app.get("/admin/artigos",
        authMiddleware,
        adminMiddleware,
        async (req, res) => {

    try {

        const [rows] = await database.execute(
            `
                SELECT
                    artigos.id,
                    artigos.titulo AS title,
                    usuarios.nome AS author,
                    artigos.status,
                    artigos.publicado_em AS published_on,
                    artigos.atualizado_em AS updated_at
                FROM artigos
                INNER JOIN usuarios
                    ON usuarios.id = artigos.autor_id
                ORDER BY artigos.criado_em DESC;
            `
        );

        const dateTime = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const articles = rows.map((article) => ({
            ...article,
            published_on: article.published_on
                ? dateTime.format(new Date(article.published_on))
                : null,
            updated_at: article.updated_at
                ? dateTime.format(new Date(article.updated_at))
                : null
        }));

        return res.status(200).json({
            message: "Artigos carregados com sucesso.",
            articles
        });

    } catch (error) {
        console.error("Erro ao buscar artigos no banco:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.post("/admin/artigos",
        authMiddleware,
        adminMiddleware,
        uploadArticleThumbnail.single("thumbnail"),
        async (req, res) => {

    try {

        const payload = normalizeArticleData(req.body);
        const errors = validateArticleData(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        const authorId = req.session.user.id;
        const slug = generateSlug(payload.title);
        const thumbnail = req.file ? req.file.filename : null;

        const [result] = await database.execute(
            `
                INSERT INTO artigos
                (
                    autor_id,
                    titulo,
                    slug,
                    resumo,
                    conteudo,
                    categorias,
                    imagem_url,
                    status,
                    publicado_em
                )
                VALUES
                (
                    ?, ?, ?, ?, ?, ?, ?, ?,
                    CASE
                        WHEN ? = 'Publicado' THEN NOW()
                        ELSE NULL
                    END
                );
            `,
            [
                authorId,
                payload.title,
                slug,
                payload.resume,
                payload.content,
                payload.categories || null,
                thumbnail,
                payload.status,
                payload.status
            ]
        );

        return res.status(201).json({
            message: "Artigo cadastrado com sucesso.",
            articleId: result.insertId
        });

    } catch (error) {
        console.error("Erro ao cadastrar artigo:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.get("/admin/artigos/:id",
        authMiddleware,
        adminMiddleware,
        async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await database.execute(
            `
                SELECT
                    id,
                    titulo AS title,
                    resumo AS resume,
                    conteudo AS content,
                    categorias AS categories,
                    imagem_url AS thumbnail,
                    status
                FROM artigos
                WHERE id = ?;
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Artigo não encontrado."
            });
        }

        return res.status(200).json({
            message: "Artigo carregado com sucesso.",
            article: rows[0]
        });

    } catch (error) {
        console.error("Erro ao buscar artigo:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.put("/admin/artigos/:id",
        authMiddleware,
        adminMiddleware,
        uploadArticleThumbnail.single("thumbnail"),
        async (req, res) => {

    let newThumbnail = null;

    try {

        const { id } = req.params;

        const payload = normalizeArticleData(req.body);
        const errors = validateArticleData(payload);

        if (Object.keys(errors).length > 0) {
            if (req.file) {
                await deleteArticleThumbnail(req.file.filename);
            }
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        newThumbnail = req.file ? req.file.filename : null;

        const [currentRows] = await database.execute(
            `
                SELECT imagem_url
                FROM artigos
                WHERE id = ?;
            `,
            [id]
        );

        if (currentRows.length === 0) {
            if (newThumbnail) {
                await deleteArticleThumbnail(newThumbnail);
            }
            return res.status(404).json({
                message: "Artigo não encontrado."
            });
        }

        const oldThumbnail = currentRows[0].imagem_url;
        const slug = generateSlug(payload.title);

        let sql = 
        `
            UPDATE artigos
            SET
                titulo = ?,
                slug = ?,
                resumo = ?,
                conteudo = ?,
                categorias = ?,
                status = ?,
                publicado_em = CASE
                    WHEN publicado_em IS NULL AND ? = 'Publicado'
                    THEN NOW()
                    ELSE publicado_em
                END,
                atualizado_em = NOW()
        `;

        const values = [
            payload.title,
            slug,
            payload.resume,
            payload.content,
            payload.categories || null,
            payload.status,
            payload.status
        ];

        if (newThumbnail) {
            sql += `,
                imagem_url = ?
            `;
            values.push(newThumbnail);
        }

        sql += `
            WHERE id = ?;
        `;

        values.push(id);

        await database.execute(sql, values);

        if (newThumbnail && oldThumbnail) {
            await deleteArticleThumbnail(oldThumbnail);
        }

        return res.status(200).json({
            message: "Artigo atualizado com sucesso."
        });

    } catch (error) {
        if (newThumbnail) {
            await deleteArticleThumbnail(newThumbnail);
        }

        console.error("Erro ao atualizar artigo:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.delete("/admin/artigos/:id",
        authMiddleware,
        adminMiddleware,
        async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await database.execute(
            `
                SELECT imagem_url
                FROM artigos
                WHERE id = ?;
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Artigo não encontrado."
            });
        }

        const thumbnail = rows[0].imagem_url;

        const [result] = await database.execute(
            `
                DELETE FROM artigos
                WHERE id = ?;
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Artigo não encontrado."
            });
        }

        if (thumbnail) {
            await deleteArticleThumbnail(thumbnail);
        }

        return res.status(200).json({
            message: "Artigo removido com sucesso."
        });

    } catch (error) {
        console.error("Erro ao remover artigo:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

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

        return res.status(200).json({
            message: "Usuários carregados com sucesso.",
            users
        });

    } catch (error) {
        console.error("Erro ao buscar usuários no banco:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.post("/admin/usuarios",
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

        const sql =
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha,
                cargo
            )
            VALUES (
                ?, ?, ?, ?
            );
        `;

        await database.execute(sql, [
            payload.name,
            payload.email,
            encryptedPassword,
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
            message: "Usuário não autenticado.",
            authenticated: false,
            user: null
        });
    }

    return res.status(200).json({
        message: "Usuário autenticado.",
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

app.get("/perfil",
       authMiddleware,
       async (req, res) => {

    try {

        const userId = req.session.user.id;

        const [rows] = await database.execute(
            `
            SELECT
                nome AS name,
                email
            FROM usuarios
            WHERE id = ?
            LIMIT 1;
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        return res.status(200).json(rows[0]);

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.put("/perfil",
       authMiddleware,
       async (req, res) => {

    try {

        const userId = req.session.user.id;

        const payload = normalizeProfileData(req.body);
        const errors = validateProfileData(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors
            });
        }

        const [userRows] = await database.execute(
            `
            SELECT
                id,
                senha
            FROM usuarios
            WHERE id = ?
            LIMIT 1;
            `,
            [userId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        const [emailRows] = await database.execute(
            `
            SELECT id
            FROM usuarios
            WHERE email = ?
                AND id <> ?
            LIMIT 1;
            `,
            [payload.email, userId]
        );

        if (emailRows.length > 0) {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors: {
                    email: "Este e-mail já está em uso."
                }
            });
        }

        const wantsToChangePassword =
            payload.currentPassword ||
            payload.password ||
            payload.confirmPassword;

        if (wantsToChangePassword) {

            const isCurrentPasswordValid = await bcrypt.compare(
                payload.currentPassword,
                userRows[0].senha
            );

            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    message: "Dados inválidos.",
                    errors: {
                        currentPassword: "Senha atual incorreta."
                    }
                });
            }

            const hashedPassword = await bcrypt.hash(
                payload.password,
                10
            );

            await database.execute(
                `
                UPDATE usuarios
                SET
                    nome = ?,
                    email = ?,
                    senha = ?
                WHERE id = ?;
                `,
                [
                    payload.name,
                    payload.email,
                    hashedPassword,
                    userId
                ]
            );

        } else {

            await database.execute(
                `
                UPDATE usuarios
                SET
                    nome = ?,
                    email = ?
                WHERE id = ?;
                `,
                [
                    payload.name,
                    payload.email,
                    userId
                ]
            );

        }

        if (req.session.user) {
            req.session.user.name = payload.name;
            req.session.user.email = payload.email;
        }

        return res.status(200).json({
            message: "Perfil atualizado com sucesso."
        });

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.get("/artigos", async (req, res) => {

    try {

        const [rows] = await database.execute(
            `
                SELECT
                    artigos.id,
                    artigos.titulo AS title,
                    artigos.slug,
                    artigos.resumo AS resume,
                    artigos.imagem_url AS thumbnail,
                    artigos.publicado_em AS published_on,
                    usuarios.nome AS author
                FROM artigos
                INNER JOIN usuarios
                    ON usuarios.id = artigos.autor_id
                WHERE artigos.status = 'Publicado'
                ORDER BY artigos.publicado_em DESC;
            `
        );

        const dateTime = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const articles = rows.map((article) => ({
            ...article,
            published_on: article.published_on
                ? dateTime.format(new Date(article.published_on))
                : null
        }));

        return res.status(200).json({
            message: "Artigos publicados carregados com sucesso.",
            articles
        });

    } catch (error) {
        console.error("Erro ao buscar artigos públicos:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.get("/artigos/:slug", async (req, res) => {

    try {

        const { slug } = req.params;

        const [rows] = await database.execute(
            `
                SELECT
                    artigos.id,
                    artigos.titulo AS title,
                    artigos.slug,
                    artigos.resumo AS resume,
                    artigos.conteudo AS content,
                    artigos.categorias AS categories,
                    artigos.imagem_url AS thumbnail,
                    artigos.publicado_em AS published_on,
                    usuarios.nome AS author
                FROM artigos
                INNER JOIN usuarios
                    ON usuarios.id = artigos.autor_id
                WHERE artigos.slug = ?
                  AND artigos.status = 'Publicado';
            `,
            [slug]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Artigo não encontrado."
            });
        }

        const dateTime = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const article = rows[0];

        return res.status(200).json({
            message: "Artigo carregado com sucesso.",
            article: {
                ...article,
                published_on: article.published_on
                    ? dateTime.format(new Date(article.published_on))
                    : null
            }
        });

    } catch (error) {
        console.error("Erro ao buscar artigo público:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.post("/newsletter", async (req, res) => {

    try {

        const payload = normalizeNewsletterData(req.body);
        const errors = validateNewsletter(payload);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Insira um e-mail.",
                errors
            });
        }

        const [rows] = await database.query(
            `
                SELECT id
                FROM newsletter
                WHERE email = ?
                LIMIT 1
            `,
            [payload.email]
        );

        if (rows.length > 0) {
            return res.status(409).json({
                message: "Este e-mail já está inscrito na newsletter."
            });
        }

        try {
            await database.query(
                `
                    INSERT INTO newsletter (email)
                    VALUES (?)
                `,
                [payload.email]
            );
        } catch (insertError) {
            if (insertError.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este e-mail já está inscrito na newsletter."
                });
            }
            throw insertError;
        }

        res.status(201).json({
            message: "Inscrição realizada com sucesso!"
        });

        sendWelcomeEmail(payload.email).catch((emailError) => {
            console.error("Erro ao enviar e-mail de boas-vindas:", emailError);
        });

    } catch (error) {
        console.error("Erro ao se inscrever na newsletter:", error);

        return res.status(500).json({
            message: "Erro interno no servidor."
        });
    }

});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Dados inválidos.",
                errors: {
                    thumbnail: "A thumbnail deve ter no máximo 5 MB."
                }
            });
        }

        return res.status(400).json({
            message: "Erro no upload da thumbnail.",
            errors: {
                thumbnail: "Não foi possível processar a imagem enviada."
            }
        });
    }

    if (error.message === "A thumbnail deve ser uma imagem JPG, PNG ou WEBP.") {
        return res.status(400).json({
            message: "Dados inválidos.",
            errors: {
                thumbnail: error.message
            }
        });
    }

    next(error);
});

app.use((error, req, res, next) => {
    console.error("Erro não tratado:", error);

    return res.status(500).json({
        message: "Erro interno no servidor."
    });
});

app.listen(port, () => {
    console.log("Servidor Rodando...");
    console.log("Porta:", port);
});