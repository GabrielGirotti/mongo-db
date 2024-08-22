import type { Request, Response } from "express";

import Shop from "../models/Shops";

export class ShopController {
  // CREANDO COMPRA

  static createShop = async (req: Request, res: Response) => {
    const shop = new Shop(req.body);

    // ASIGNANDO UN MANAGER
    shop.manager = req.user.id;

    try {
      await shop.save();
      res.send("Compra creada correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENIENDO TODAS LAS COMPRAS

  static getAllShops = async (req: Request, res: Response) => {
    try {
      const allShops = await Shop.find({
        $or: [{ manager: { $in: req.user.id } }],
      });

      res.json(allShops);
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENIENDO UNA COMPRA POR ID

  static getShopById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const shop = await Shop.findById(id).populate("lists");
      if (!shop) {
        const error = new Error("Compra no encontrada");
        return res.status(404).json({ error: error.message });
      }

      if (shop.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "No tiene los privilegios para ver esta compra"
        );
        return res.status(404).json({ error: error.message });
      }
      res.json(shop);
    } catch (error) {
      console.log(error);
    }
  };

  // EDITANDO UNA COMPRA

  static updateShop = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const shop = await Shop.findById(id);
      if (!shop) {
        const error = new Error("Compra no encontrada");
        return res.status(404).json({ error: error.message });
      }

      if (shop.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "No tiene los privilegios para editar esta compra"
        );
        return res.status(404).json({ error: error.message });
      }

      shop.shopName = req.body.shopName;
      shop.localName = req.body.localName;
      shop.description = req.body.description;

      await shop.save();
      res.json("Compra actualizada");
    } catch (error) {
      console.log(error);
    }
  };

  // ELIMINANDO UNA COMPRA

  static deleteShop = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const shop = await Shop.findById(id);
      if (!shop) {
        const error = new Error("Compra no encontrada");
        return res.status(404).json({ error: error.message });
      }

      if (shop.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "No tiene los privilegios para eliminar esta compra"
        );
        return res.status(404).json({ error: error.message });
      }

      await shop.deleteOne();
      res.send("Compra eliminada");
    } catch (error) {
      console.log(error);
    }
  };
}
