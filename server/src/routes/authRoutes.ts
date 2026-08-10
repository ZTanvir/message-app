import { Router } from "express";
import { loginController } from "../controllers/authControllers.ts";
import { validateBody } from "../middlewares/validation.ts";
import { LoginValidationSchema } from "@message-app/shared/zodSchemas/validationSchema.ts";

const authRoute = Router();

authRoute.post("/signup", (req, res) => {
  res.json("auth signup route");
});
authRoute.post("/login", validateBody(LoginValidationSchema), loginController);

export default authRoute;
