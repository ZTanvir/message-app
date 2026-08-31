import { Router } from "express";
import { getProfile } from "../controllers/profileControllers.ts";
import multer from "multer";
import supabase from "../lib/supabase.ts";
import passport from "passport";
import type { UserTokenData } from "../types/user.ts";
import AppError from "../utils/appError.ts";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
}).single("cover");

const profileRoute = Router();
profileRoute.use(passport.authenticate("jwt", { session: false }));

profileRoute.post("/uploadCover", (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log("multer error", err);
      return;
    } else if (err) {
      console.log("error", err);
      return;
    }

    console.log(req.file);
    console.log(req.user);

    const file = req.file;
    const user = req.user as UserTokenData;
    if (!file) throw new AppError("File not uploaded.", 404);

    if (!user) throw new AppError("User not authorized.", 401);

    const { data, error } = await supabase.storage
      .from("message_app")
      .upload(`${user.email}/profile/${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new AppError(error.message, error.status || 400);
    }
  });
});

profileRoute.get("/:userId", getProfile);

export default profileRoute;
