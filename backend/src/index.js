import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

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

app.listen(port, () => {
    console.log("Servidor Rodando...");
    console.log("Porta:", port);
});