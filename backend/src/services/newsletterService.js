import nodemailer from "nodemailer";
import { newsletterEmail } from "../templates/newsletterEmail.js";

const currentYear = new Date().getFullYear();

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

export async function sendWelcomeEmail(email) {

    const html = newsletterEmail({
        blogUrl: `${process.env.APP_URL}/blog`,
        instagramUrl: "https://www.instagram.com/josylinhas/",
        logoUrl: process.env.APP_LOGO,
        currentYear: currentYear
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Boas-Vindas à Newsletter da Josylinhas!",
        html
    });

}