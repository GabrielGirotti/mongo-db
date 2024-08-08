import { Router } from "express";
import { ListController } from "../controllers/ListController";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares";

const router = Router();

// CREANDO LISTA

router.post(
  "/",
  body("shopName")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),
    handleInputErrors,
    body("localName")
    .notEmpty()
    .withMessage("El nombre del super no puede ir vacio"),
    handleInputErrors,
    body("description")
    .notEmpty()
    .withMessage("La lista no puede ir vacia"),
    handleInputErrors,
  ListController.createList
);

// OBTENIENDO TODAS LAS LISTAS

router.get("/", ListController.getAllLists);

export default router;
