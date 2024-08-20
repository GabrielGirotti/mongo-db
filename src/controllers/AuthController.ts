import type { Request, Response } from "express";
import User from "../models/User";
import { checkPass, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { tokenGenerator } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";

export class AuthController {
  // CREANDO USUARIO

  static createUser = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevenir usuario con mail duplicado
      const userExist = await User.findOne({ email });

      if (userExist) {
        const error = new Error(
          "El Email que intentas utilizar ya esta registrado"
        );
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);

      //Hasheando pass
      user.password = await hashPassword(password);

      //Generando token
      const token = new Token();
      token.token = tokenGenerator();
      token.user = user.id;

      //Enviando mail con Token
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send(
        "Usuario creado correctamente, revisa tu email para confirmar la cuenta"
      );
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error(
          "El Token ingresado ha caducado o no es valido"
        );
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = await req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El E-mail ingresado no es valido");
        return res.status(404).json({ error: error.message });
      }
      if (!user.confirmed) {
        const token = new Token();
        token.token = tokenGenerator();
        token.user = user.id;
        await token.save();

        //Enviando mail con Token
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "El E-mail ingresado no esta validado, hemos enviado un nuevo mail para confirmar su cuenta"
        );
        return res.status(401).json({ error: error.message });
      }

      const checkingPass = await checkPass(password, user.password);
      if (!checkingPass) {
        const error = new Error("El password ingresado no es valido");
        return res.status(401).json({ error: error.message });
      }
      res.send("Autenticado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
