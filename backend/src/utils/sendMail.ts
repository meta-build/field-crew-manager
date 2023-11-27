import { createTransport, Transporter } from 'nodemailer';
import * as dotenv from "dotenv";
dotenv.config();

export async function sendEmail(emailOptions: any) {
  try {
    // Log para verificar se a criação do transporte está ocorrendo
    console.log('Creating transporter...');

    // Configuração do transporte SMTP
    const transporter: Transporter = createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PW_MAIL,
      },
    });

    // Log para verificar se o transporte foi criado com sucesso
    console.log('Transporter created:', transporter);

    // Envio do e-mail
    console.log('Sending email...');
    const info = await transporter.sendMail(emailOptions);
    console.log(`E-mail enviado para: '${emailOptions.to}', messageId: ${info.messageId}`);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
}
