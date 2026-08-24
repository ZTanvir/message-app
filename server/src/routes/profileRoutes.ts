import { Router } from "express";
import { getProfile } from "../controllers/profileControllers.ts";
const profileRoute = Router();

profileRoute.get("/:userId", getProfile);

export default profileRoute;
