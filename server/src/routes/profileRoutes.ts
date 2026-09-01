import { Router } from "express";
import {
  getProfile,
  uploadCoverImg,
} from "../controllers/profileControllers.ts";
import passport from "passport";

const profileRoute = Router();
profileRoute.use(passport.authenticate("jwt", { session: false }));

profileRoute.post("/uploadCover", uploadCoverImg);

profileRoute.get("/:userId", getProfile);

export default profileRoute;
