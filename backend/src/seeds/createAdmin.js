import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import database from "../config/database.js";

dotenv.config();

const allowedQuestions = [
    "Nome da primeira escola que frequentou",
    "Seu apelido de infância que sua família usava",
    "Nome do primeiro animal de estimação",
    "Título do seu livro favorito",
    "Nome da primeira empresa onde trabalhou"
];

async function createAdmin() {

    try {

        const {
            ADMIN_NAME,
            ADMIN_EMAIL,
            ADMIN_PASSWORD,
            ADMIN_SECRET_QUESTION,
            ADMIN_SECRET_ANSWER
        } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD ||
            !ADMIN_SECRET_QUESTION || !ADMIN_SECRET_ANSWER) {
            console.error("Erro: Os parâmetros do administrador inicial se encontram incompletos no arquivo .env.");
            return;
        }

        if (!allowedQuestions.includes(ADMIN_SECRET_QUESTION)) {
            console.error("Pergunta secreta inválida.");
            return;
        }

        const [existingUsers] = await database.query(
            `
                SELECT id
                FROM usuarios
                WHERE email = ?
                LIMIT 1
            `,
            [ADMIN_EMAIL]
        );

        if (existingUsers.length > 0) {
            console.log("Administrador inicial já existente. Nenhum registro foi criado.");
            return;
        }

        const encryptedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const encryptedAnswer = await bcrypt.hash(ADMIN_SECRET_ANSWER, 10);

        await database.query(
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
            `,
            [
                ADMIN_NAME,
                ADMIN_EMAIL,
                encryptedPassword,
                ADMIN_SECRET_QUESTION,
                encryptedAnswer,
                "SuperAdmin"
            ]
        );

        console.log("Administrador inicial criado com sucesso!");

    } catch (error) {
        console.error("Erro ao criar administrador inicial:", error);
    } finally {
        await database.end();
    }

}

createAdmin();