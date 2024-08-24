import { Router } from "express";
import { ShopController } from "../controllers/ShopController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares";
import { ListsController } from "../controllers/ListsController";
import { validateShopExist } from "../middlewares/shops";
import { listBelongToShop, listExist } from "../middlewares/list";
import { authenticate } from "../middlewares/auth";
import { TeamController } from "../controllers/TeamController";

const router = Router();
router.use(authenticate)

// CREANDO COMPRA

router.post(
  "/",
  body("shopName")
    .notEmpty()
    .withMessage("El nombre de la compra no puede ir vacío"),
  body("localName")
    .notEmpty()
    .withMessage("El nombre del local no puede ir vacío"),
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
    .withMessage("El nombre de la compra no puede ir vacío"),
  body("localName")
    .notEmpty()
    .withMessage("El nombre del local no puede ir vacío"),
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

// RUTAS DE LAS LISTAS ////////////////////////////////////////////////////////

// VALIDANDO QUE EXISTA LA COMPRA POR ID

router.param("shopId", validateShopExist);

// CREANDO LISTA EN UN PROYECTO

router.post(
  "/:shopId/lists",
  body("name")
    .notEmpty()
    .withMessage("El nombre de la lista no puede ir vacío"),
  body("description").notEmpty().withMessage("La lista no puede ir vacía"),
  handleInputErrors,
  ListsController.createList
);

// OBTENIENDO LISTA EN UN PROYECTO

router.get("/:shopId/lists", ListsController.getListsFromProject);

// VALIDANDO QUE EXISTA UNA LISTA POR ID

router.param("listId", listExist);

// VALIDANDO QUE EXISTA LA LISTA PERTENEZCA A UN PROYECTO ACTIVO

router.param("listId", listBelongToShop);

// OBTENIENDO LISTA POR ID

router.get(
  "/:shopId/lists/:listId",
  param("listId").isMongoId().withMessage("El id es incorrecto"),
  handleInputErrors,
  ListsController.getListById
);

// ACTUALIZANDO LISTA POR ID

router.put(
  "/:shopId/lists/:listId",
  param("listId").isMongoId().withMessage("El id es incorrecto"),
  body("name")
    .notEmpty()
    .withMessage("El nombre de la lista no puede ir vacío"),
  body("description").notEmpty().withMessage("La lista no puede ir vacía"),
  handleInputErrors,
  ListsController.updateList
);

// ACTUALIZANDO ESTADO

router.post(
  "/:shopId/lists/:listId/status",
  param("listId").isMongoId().withMessage("El id es incorrecto"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputErrors,
  ListsController.updateStatus
);

// ELIMINANDO LISTA POR ID

router.delete(
  "/:shopId/lists/:listId",
  param("listId").isMongoId().withMessage("El id es incorrecto"),
  handleInputErrors,
  ListsController.deleteList
);

// RUTAS DEL EQUIPO ////////////////////////////////////////////////////////

// BUSCANDO USUARIO

router.post('/:shopId/team/find',
  body('email').isEmail().toLowerCase().withMessage('E-mail no válido'),
  handleInputErrors,
  TeamController.findMemberById
)

// ASIGNANDO USUARIO A COMPRA

router.post('/:shopId/team',
  body("id").isMongoId().withMessage("El id es incorrecto"),
  handleInputErrors,
  TeamController.addUserToAShop
)

 // ELIMINANDO USUARIO DE UNA COMPRA

router.delete('/:shopId/team',
  body("id").isMongoId().withMessage("El id es incorrecto"),
  handleInputErrors,
  TeamController.deleteUserFromShop
)

// OBTENIENDO USUARIOS EN UNA COMPRA

router.get("/:shopId/team", TeamController.getUsersFromShop);

export default router;
