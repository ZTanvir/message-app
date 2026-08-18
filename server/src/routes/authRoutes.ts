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
} from "../controllers/authControllers.ts";

const authRoute = Router();

authRoute.post(
  "/signup",
  validateBody(SignUpValidationSchema),
  signupController,
);
authRoute.post("/login", validateBody(LoginValidationSchema), loginController);

authRoute.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully logout" });
});

authRoute.get(
  "/isLoggedIn",
  passport.authenticate("jwt", { session: false }),
  isLoggedInController,
);

export default authRoute;
