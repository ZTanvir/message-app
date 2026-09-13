import { Router } from "express";
import {
  getProfile,
  uploadCoverImg,
  uploadProfileImg,
  editProfile,
  aboutMe,
} from "../controllers/profileControllers.ts";
import { validateBody } from "../middlewares/validation.ts";
import {
  EditProfileSchema,
  EditAboutMeSchema,
} from "@message-app/shared/zodSchemas/validationSchema.ts";
import passport from "passport";

const profileRoute = Router();
// broken window - fix the auth case with proper response
profileRoute.use(passport.authenticate("jwt", { session: false }));

profileRoute.post("/uploadCoverImg", uploadCoverImg);
profileRoute.post("/uploadProfileImg", uploadProfileImg);
profileRoute.get("/:userId", getProfile);
profileRoute.patch(
  "/editProfile",
  validateBody(EditProfileSchema),
  editProfile,
);
profileRoute.patch("/aboutMe", validateBody(EditAboutMeSchema), aboutMe);

export default profileRoute;
