import type { Request, Response } from "express";
import User from "../models/User";
import Shop from "../models/Shops";

export class TeamController {
  // BUSCANDO USUARIO

  static findMemberById = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email }).select("id email name");
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  };

  // ASIGNANDO USUARIO A COMPRA

  static addUserToAShop = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const user = await User.findById(id);

      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }

      if (req.shop.team.includes(user.id)) {
        const error = new Error("El usuario ya se encuentra en la compra");
        return res.status(409).json({ error: error.message });
      }

      req.shop.team.push(id);
      await req.shop.save();
      res.send("Usuario agregado a la compra");
    } catch (error) {
      console.log(error);
    }
  };

  // ELIMINANDO USUARIO DE UNA COMPRA

  static deleteUserFromShop = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!req.shop.team.toString().includes(userId)) {
      const error = new Error("El usuario no se encuentra en la compra");
      return res.status(404).json({ error: error.message });
    }

    req.shop.team = req.shop.team.filter((member) => member.toString() !== userId);
    await req.shop.save();
    res.send("Usuario eliminado de la compra");
  };

  // OBTENIENDO USUARIOS DENTRO DE UNA COMPRA

  static getUsersFromShop = async (req: Request, res: Response) => {
    try {
      const shop = await Shop.findById(req.shop.id).populate({
        path: "team",
        select: "id name email",
      });

      res.json(shop.team);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
