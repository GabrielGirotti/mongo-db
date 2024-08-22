import type { Request, Response } from "express";
import User from "../models/User";
import { checkPass, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { tokenGenerator } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  // CREANDO USUARIO

  static createUser = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevenir usuario con mail duplicado
      const userExist = await User.findOne({ email });

      if (userExist) {
        const error = new Error(
          "El E-mail que intentas utilizar ya está registrado"
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
          "El Token ingresado ha caducado o no es válido"
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
        const error = new Error("El E-mail ingresado no es válido");
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
        const error = new Error("El password ingresado no es válido");
        return res.status(401).json({ error: error.message });
      }

      const token = generateJWT({ id: user.id });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static reqConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Buscar si el usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error(
          "El E-mail que intentas utilizar no está registrado"
        );
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error(
          "El E-mail que has puesto ya se encuentra registrado"
        );
        return res.status(403).json({ error: error.message });
      }

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

      res.send("Revisa tu email para confirmar la cuenta");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static changingPass = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Buscar si el usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error(
          "El E-mail que intentas utilizar no está registrado"
        );
        return res.status(404).json({ error: error.message });
      }

      //Generando token
      const token = new Token();
      token.token = tokenGenerator();
      token.user = user.id;

      await token.save();

      //Enviando mail con Token
      AuthEmail.changePassword({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send(
        "Ingresa a tu E-mail y sigue las instrucciones para restablecer tu password"
      );
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static tokenForNewPass = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("El Token no es válido");
        return res.status(404).json({ error: error.message });
      }
      res.send("Token confirmado correctamente, reestablece tu password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static createNewPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("El Token no es válido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);

      //Hasheando pass
      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Password reestablecido correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static userLogin = async (req: Request, res: Response) => {
    return res.json(req.user);
  };
}
