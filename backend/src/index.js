import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import database from "./config/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor Rodando...");
});

app.post("/cadastrar-admin", async (req, res) => {

    try {

        const {
            name, email, password, secretQuestion, questionAnswer
        } = req.body;

        if (!name || !email || !password || !secretQuestion || !questionAnswer) {
            return res.status(400).json({
                message: "Preencha todos os campos obrigatórios."
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const encryptedAnswer = await bcrypt.hash(questionAnswer, 10);

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
            name,
            email,
            encryptedPassword,
            secretQuestion,
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

app.post("/esqueci-senha", async (req, res) => {

    try {

        const { email } = req.body;

        const successMessage = {
            message: "Se o e-mail existir, enviaremos o passo a passo para redefinir sua senha."
        };

        if (!email) {
            return res.status(400).json({
                message: "Informe um e-mail válido."
            });
        }

        const [users] = await database.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
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
            to: email,
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

        const {
            token, newPassword, repeatPassword
        } = req.body;

        if (!token || !newPassword || !repeatPassword) {
            return res.status(400).json({
                message: "Token e senha são obrigatórios."
            });
        }

        if (newPassword !== repeatPassword) {
            return res.status(400).json({
                message: "As senhas não coincidem."
            });
        }

        const hashedToken = crypto
                .createHash("sha256")
                .update(token)
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

        const hashedPassword = await bcrypt.hash(newPassword, 10);

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