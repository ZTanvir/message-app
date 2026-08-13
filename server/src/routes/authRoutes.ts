import { Router } from "express";
import { loginController } from "../controllers/authControllers.ts";
import { validateBody } from "../middlewares/validation.ts";
import {
  LoginValidationSchema,
  SignUpValidationSchema,
} from "@message-app/shared/zodSchemas/validationSchema.ts";
import passport from "passport";
import { signupController } from "../controllers/authControllers.ts";

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
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Auth done", user: req.user });
  },
);

export default authRoute;
