import type { Request, Response } from "express";
import List from "../models/Lists";

export class ListController {

  // CREANDO LISTA

  static createList = async (req: Request, res: Response) => {
    const list = new List(req.body);

    try {
      await list.save();
      res.send("Lista creada correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENIENDO TODAS LAS LISTAS

  static getAllLists = async (req: Request, res: Response) => {
try {
    const allLists = await List.find({})
    res.json(allLists)
} catch (error) {
    console.log(error)
}
  };
}
