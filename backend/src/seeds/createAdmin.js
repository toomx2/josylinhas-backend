import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import database from "../config/database.js";

dotenv.config();

async function createAdmin() {

    try {

        const {
            ADMIN_NAME,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
        } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.error("Erro: Os parâmetros do administrador inicial se encontram incompletos no arquivo .env.");
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

        await database.query(
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
            `,
            [
                ADMIN_NAME,
                ADMIN_EMAIL,
                encryptedPassword,
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