import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "DCompras <admin@dcompras.com>",
      to: user.email,
      subject: "Confirma tu cuenta en DCompras!!!",
      text: "DCompras - Confirma tu cuenta",
      html: `<p>Hola ${user.name}, ya has creado tu cuenta en DCompras, solo queda un último paso!</p>
      <p>Ingresa al siguiente link: <a href="${process.env.FRONTEND_URL}/auth/confirm-account">DCompras.com</a> </p>
      <p>y coloca tu número de Token para validar tu email:</p>
      <p><b>${user.token}</b></p>
      <p>Este Token expira en 10 minutos...</p>`,
    });
    console.log("Mensaje enviado", info.messageId);
  };

  static changePassword = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "DCompras <admin@dcompras.com>",
      to: user.email,
      subject: "DCompras - Reestablece tu password",
      text: "DCompras - Reestablece tu password",
      html: `<p>Hola ${user.name}, has solicitado reestablecer tu password.</p>
      <p>Ingresa al siguiente link: <a href="${process.env.FRONTEND_URL}/auth/new-password">REESTABLECER PASSWORD</a> </p>
      <p>Ingresa el código:</p>
      <p><b>${user.token}</b></p>
      <p>Este Token expira en 10 minutos...</p>`,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
