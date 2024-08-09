import type { Request, Response } from "express";
import List from "../models/Lists";

export class ListsController {
  // CREANDO LISTA DENTRO DE UN PROYECTO

  static createList = async (req: Request, res: Response) => {
    try {
      const list = new List(req.body);
      list.shop = req.shop.id;
      req.shop.lists.push(list.id);
      await Promise.allSettled([list.save(), req.shop.save()]);
      res.send("Tarea creada correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
