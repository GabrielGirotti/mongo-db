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
      const allLists = await List.find({});
      res.json(allLists);
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENIENDO UNA LISTA POR ID

  static getListById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const list = await List.findById(id);
      if (!list) {
        const error = new Error("Lista no encontrada");
        return res.status(404).json({ error: error.message });
      }
      res.json(list);
    } catch (error) {
      console.log(error);
    }
  };

  // EDITANDO UNA LISTA

  static updateList = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const list = await List.findByIdAndUpdate(id, req.body);
      if (!list) {
        const error = new Error("Lista no encontrada");
        return res.status(404).json({ error: error.message });
      }

      await list.save();
      res.json("Lista actualizada");
    } catch (error) {
      console.log(error);
    }
  };

  // ELIMINANDO UNA LISTA

  static deleteList = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const list = await List.findById(id);
      if (!list) {
        const error = new Error("Lista no encontrada");
        return res.status(404).json({ error: error.message });
      }
      await list.deleteOne();
      res.send("Lista eliminada");
    } catch (error) {
      console.log(error);
    }
  };
}
