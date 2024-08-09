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
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // OBTENIENDO LISTAS DENTRO DE UN PROYECTO

  static getListsFromProject = async (req: Request, res: Response) => {
    try {
      const allLists = await List.find({ shop: req.shop.id }).populate("shop");
      res.json(allLists);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // OBTENIENDO LISTA POR ID

  static getListById = async (req: Request, res: Response) => {
    try {
      const { listId } = req.params;
      const list = await List.findById(listId)
      if (!list) {
        const error = new Error("Lista no encontrada");
        return res.status(404).json({ error: error.message });
      }

      if(list.shop.toString() !== req.shop.id){
        const error = new Error("No podemos procesar su busqueda");
        return res.status(400).json({ error: error.message });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}



