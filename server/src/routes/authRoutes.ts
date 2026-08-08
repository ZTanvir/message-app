import { Router } from "express";
import { loginController } from "../controllers/authControllers.ts";

const authRoute = Router();

authRoute.post("/signup", (req, res) => {
  res.json("auth signup route");
});
authRoute.post("/login", loginController);

export default authRoute;
