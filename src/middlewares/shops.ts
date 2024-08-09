import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import Shop, { IShop } from "../models/Shops";

declare global {
  namespace Express {
    interface Request {
      shop: IShop;
    }
  }
}

export async function validateShopExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      const error = new Error("Compra no encontrada");
      return res.status(404).json({ error: error.message });
    }
    req.shop = shop
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
