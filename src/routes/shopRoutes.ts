import { Router } from "express";
import { ShopController } from "../controllers/ShopController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares";
import { ListsController } from "../controllers/ListsController";
import { validateShopExist } from "../middlewares/shops";

const router = Router();

// CREANDO COMPRA

router.post(
  "/",
  body("shopName")
    .notEmpty()
    .withMessage("El nombre de la compra no puede ir vacio"),
  body("localName")
    .notEmpty()
    .withMessage("El nombre del local no puede ir vacio"),
  handleInputErrors,
  ShopController.createShop
);

// OBTENIENDO TODAS LAS COMPRAS

router.get("/", ShopController.getAllShops);

// OBTENIENDO COMPRA POR ID

router.get(
  "/:id",
  param("id").isMongoId().withMessage("El id es incorrecto"),
  handleInputErrors,
  ShopController.getShopById
);

// EDITANDO UNA COMPRA
router.put(
  "/:id",
  param("id").isMongoId().withMessage("El id es incorrecto"),
  body("shopName")
    .notEmpty()
    .withMessage("El nombre de la compra no puede ir vacio"),
  body("localName")
    .notEmpty()
    .withMessage("El nombre del local no puede ir vacio"),
  handleInputErrors,
  ShopController.updateShop
);

// ELIMINANDO UNA COMPRA
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("El id es incorrecto"),
  handleInputErrors,
  ShopController.deleteShop
);

// RUTAS DE LAS LISTAS

// CREANDO LISTA EN UN PROYECTO

router.post(
  "/:shopId/lists",
  validateShopExist,
  body("name")
    .notEmpty()
    .withMessage("El nombre de la lista no puede ir vacio"),
  body("description").notEmpty().withMessage("La lista no puede ir vacia"),
  handleInputErrors,
  ListsController.createList
);

export default router;
