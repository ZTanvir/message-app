import { Router } from "express";

const authRoute = Router();

authRoute.post("/signup", (req, res) => {
  res.json("auth signup route");
});
authRoute.post("/login", (req, res) => {
  res.json("auth login route");
});

export default authRoute;
