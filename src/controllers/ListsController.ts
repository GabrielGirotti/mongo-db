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
      res.send("Lista creada correctamente");
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
      const list = await List.findById(req.list.id).populate({
        path: "completedBy.user",
        select: "id name email",
      });
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // EDITANDO LISTA POR ID

  static updateList = async (req: Request, res: Response) => {
    try {
      req.list.name = req.body.name;
      req.list.description = req.body.description;
      await req.list.save();
      res.send("Lista actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // EDITANDO STATUS

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.list.status = status;

      const data = {
        user: req.user.id,
        status: status,
      };

      req.list.completedBy.push(data);

      await req.list.save();
      res.send("Estado actualizado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // ELIMINANDO LISTA POR ID

  static deleteList = async (req: Request, res: Response) => {
    try {
      req.shop.lists = req.shop.lists.filter(
        (list) => list.toString() !== req.list.id.toString()
      );

      await Promise.allSettled([req.list.deleteOne(), req.shop.save()]);

      res.send("Lista eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
