import { Request, Response, NextFunction } from "express";
import List, { IList } from "../models/Lists";

declare global {
  namespace Express {
    interface Request {
      list: IList;
    }
  }
}

export async function listExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { listId } = req.params;
    const list = await List.findById(listId);
    if (!list) {
      const error = new Error("Lista no encontrada");
      return res.status(404).json({ error: error.message });
    }
    req.list = list;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export async function listBelongToShop(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.list.shop.toString() !== req.shop.id.toString()) {
    const error = new Error("No podemos procesar su busqueda");
    return res.status(400).json({ error: error.message });
  }
  next();
}
