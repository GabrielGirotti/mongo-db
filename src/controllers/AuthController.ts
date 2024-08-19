import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

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

      await user.save();
      res.send(
        "Usuario creado correctamente, revisa tu email para confirmar la cuenta"
      );
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
