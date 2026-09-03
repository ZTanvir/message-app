import { Router } from "express";
import {
  getProfile,
  uploadCoverImg,
  uploadProfileImg,
} from "../controllers/profileControllers.ts";
import passport from "passport";

const profileRoute = Router();
// broken window - fix the auth case with proper response
profileRoute.use(passport.authenticate("jwt", { session: false }));

profileRoute.post("/uploadCoverImg", uploadCoverImg);
profileRoute.post("/uploadProfileImg", uploadProfileImg);

profileRoute.get("/:userId", getProfile);

export default profileRoute;
