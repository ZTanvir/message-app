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
    fileSize: 2 * 1024 * 1024,
  },
}).single("cover");

const profileRoute = Router();
profileRoute.use(passport.authenticate("jwt", { session: false }));

profileRoute.post("/uploadCover", (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return next(new AppError(`${err.message}.Maximum size 2MB.`, 400));
    } else if (err) {
      return next(err);
    }

    try {
      const file = req.file;
      const user = req.user as UserTokenData;
      if (!file) return next(new AppError("File not uploaded.", 404));

      if (!user) return next(new AppError("User not authorized.", 401));

      const { data, error } = await supabase.storage
        .from("message_app")
        .upload(`${user.email}/profile/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        return next(new AppError(error.message, error.status || 400));
      }
      console.log(data);

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });
});

profileRoute.get("/:userId", getProfile);

export default profileRoute;
