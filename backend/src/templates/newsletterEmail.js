export function newsletterEmail({ blogUrl, instagramUrl, logoUrl, currentYear }) {
    return `
        <div style="
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            border: 1px solid #eeeeee;
            border-radius: 12px;
            overflow: hidden;
        ">
            <div style="
                background-color: #fff3f8;
                padding: 24px;
                text-align: center;
                border-bottom: 1px solid #eeeeee;
            ">
                <img src="${logoUrl}"
                     alt="Josylinhas"
                     width="80"
                     style="display: block; margin: 0 auto 12px; border-radius: 8px;" />

                <h1 style="margin: 0; color: #c2185b; font-size: 24px;">
                    Boas-Vindas à Nossa Newsletter!
                </h1>
            </div>

            <div style="padding: 28px; color: #333333; font-size: 15px; line-height: 1.6;">
                <p>Obrigado por se inscrever na newsletter da <strong>Josylinhas</strong>.</p>

                <p>
                    A partir de agora, você poderá receber novidades sobre novos artigos,
                    tendências, dicas e conteúdos do blog.
                </p>

                <div style="
                    background-color: #fff3f8;
                    border-left: 5px solid #c2185b;
                    padding: 16px;
                    margin: 24px 0;
                    border-radius: 6px;
                ">
                    ✨ Você receberá notificações sobre novas publicações e conteúdos relacionados à Josylinhas.
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${blogUrl}" style="
                        display: inline-block;
                        background-color: #c2185b;
                        color: #ffffff;
                        padding: 12px 26px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: bold;
                    ">
                        Visitar Blog
                    </a>
                </div>

                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 28px 0;" />

                <p style="text-align: center; color: #666666; font-size: 14px;">
                    Acompanhe também no Instagram:
                </p>

                <p style="text-align: center; margin: 0;">
                    <a href="${instagramUrl}" style="color: #c2185b; text-decoration: none; font-weight: bold;">
                        @josylinhas
                    </a>
                </p>
            </div>

            <div style="
                background-color: #f5f5f5;
                text-align: center;
                padding: 20px;
                color: #666666;
                font-size: 13px;
            ">
                <strong>Josylinhas 💜</strong>
                <br />
                Roupas artesanais feitas com carinho.
                <br /><br />
                © ${currentYear} Josylinhas. Todos os direitos reservados.
            </div>
        </div>
    `;
}