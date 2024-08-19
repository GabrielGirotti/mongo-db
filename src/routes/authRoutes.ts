import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post(
  "/create-account",
  body("email")
    .isEmail()
    .withMessage("Formato de email no valido")
    .notEmpty()
    .withMessage("El email no puede ir vacio"),
  body("name").notEmpty().withMessage("El nombre de usuario no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password debe tener minimo 8 caracteres")
    .notEmpty()
    .withMessage("El password no puede ir vacio"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("El password no coincide");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createUser
);

export default router;
