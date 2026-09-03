import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import AppError from "../utils/appError.ts";
import multer from "multer";
import supabase from "../lib/supabase.ts";
import type { UserTokenData } from "../types/user.ts";
const storage = multer.memoryStorage();
const uploadCoverImgFile = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 1MB
  },
}).single("coverImg");

const uploadProfileImgFile = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
}).single("profileImg");

export async function getProfile(req: Request, res: Response) {
  const { userId } = req.params;
  if (!userId) throw new AppError("User id not found", 400);

  const normalizeUserId = Array.isArray(userId) ? userId[0] : userId;

  const user = await prisma.profile.findUnique({
    where: { userId: normalizeUserId },
  });
  if (!user) throw new AppError("Profile not found", 404);
  return res.status(200).json({ user, success: true });
}

export function uploadCoverImg(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadCoverImgFile(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE": {
          return next(new AppError(`${err.message}.Maximum size 2MB.`, 400));
        }
        default:
          return next(new AppError(`${err.message}`, 400));
      }
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
      const updatedProfile = await prisma.profile.update({
        where: {
          userId: user.id,
        },
        data: {
          coverImgUrl: data.fullPath,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Cover image added successfully." });
    } catch (error) {
      next(error);
    }
  });
}

export function uploadProfileImg(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadProfileImgFile(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE": {
          return next(new AppError(`${err.message}.Maximum size 1MB.`, 400));
        }
        default:
          return next(new AppError(`${err.message}`, 400));
      }
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
      const updatedProfile = await prisma.profile.update({
        where: {
          userId: user.id,
        },
        data: {
          profileImgUrl: data.fullPath,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Profile image added successfully." });
    } catch (error) {
      next(error);
    }
  });
}
