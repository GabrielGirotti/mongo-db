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
      html: `<p>Hola ${user.name}, ya has creado tu cuenta en DCompras, solo queda un ultimo paso!</p>
      <p>Ingresa al siguiente link: <a href="">DCompras.com</a> </p>
      <p>y coloca tu numero de Token para validar tu email:</p>
      <p><b>${user.token}</b></p>
      <p>Este Token expira en 10 minutos...</p>`,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
