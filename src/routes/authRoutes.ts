import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post(
  "/create-account",
  body("email")
    .isEmail()
    .withMessage("Formato de email no válido")
    .notEmpty()
    .withMessage("El email no puede ir vacío"),
  body("name").notEmpty().withMessage("El nombre de usuario no puede ir vacío"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password debe tener mínimo 8 caracteres")
    .notEmpty()
    .withMessage("El password no puede ir vacío"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("El password no coincide");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createUser
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El Token no puede ir vacío"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Formato de email no válido")
    .notEmpty()
    .withMessage("El email no puede ir vacío"),
  body("password").notEmpty().withMessage("El password no puede ir vacío"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/new-code",
  body("email")
    .isEmail()
    .withMessage("Formato de email no válido")
    .notEmpty()
    .withMessage("El email no puede ir vacío"),
  handleInputErrors,
  AuthController.reqConfirmationCode
);

router.post(
  "/forgot-password",
  body("email")
    .isEmail()
    .withMessage("Formato de email no válido")
    .notEmpty()
    .withMessage("El email no puede ir vacío"),
  handleInputErrors,
  AuthController.changingPass
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El Token no puede ir vacío"),
  handleInputErrors,
  AuthController.tokenForNewPass
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("El Token no es válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password debe tener mínimo  8 caracteres")
    .notEmpty()
    .withMessage("El password no puede ir vacío"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("El password no coincide");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createNewPassword
);

router.get('/user',
  authenticate,
  AuthController.userLogin
)

export default router;
