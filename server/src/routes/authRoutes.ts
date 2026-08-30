import { Router } from "express";
import { loginController } from "../controllers/authControllers.ts";
import { validateBody } from "../middlewares/validation.ts";
import {
  LoginValidationSchema,
  SignUpValidationSchema,
} from "@message-app/shared/zodSchemas/validationSchema.ts";
import passport from "passport";
import {
  signupController,
  isLoggedInController,
  logoutController,
} from "../controllers/authControllers.ts";

const authRoute = Router();

authRoute.post(
  "/signup",
  validateBody(SignUpValidationSchema),
  signupController,
);
authRoute.post("/login", validateBody(LoginValidationSchema), loginController);

authRoute.post("/logout", logoutController);

authRoute.get(
  "/isLoggedIn",
  passport.authenticate("jwt", { session: false }),
  isLoggedInController,
);

export default authRoute;
