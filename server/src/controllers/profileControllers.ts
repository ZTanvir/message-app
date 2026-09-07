import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import AppError from "../utils/appError.ts";
import multer from "multer";
import supabase from "../lib/supabase.ts";
import type { UserTokenData } from "../types/user.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
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
      const user = req.user as UserTokenData;
      if (!user) return next(new AppError("User not authorized.", 401));

      const file = req.file;
      // User don't want any cover photo
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: user.id,
        },
      });
      if (!file) {
        if (userProfile?.coverImgUrl) {
          const { data, error } = await supabase.storage
            .from("message_app")
            .remove([`${userProfile?.coverImgUrl}`]);
          if (error) {
            return next(new AppError("No cover photo added,yet.", 404));
          }
          await prisma.profile.update({
            where: {
              userId: user.id,
            },
            data: {
              coverImgUrl: null,
            },
          });
          return res.status(200).json({
            success: true,
            message: "Cover image removed successfully.",
          });
        } else {
          return next(new AppError("No cover photo added,yet.", 404));
        }
      }

      const { data, error } = await supabase.storage
        .from("message_app")
        .upload(
          `${user.id}/assets/photos/cover/${file.originalname}`,
          file.buffer,
          {
            contentType: file.mimetype,
          },
        );
      if (error) {
        return next(new AppError(error.message, error.status || 400));
      }
      const updatedProfile = await prisma.profile.update({
        where: {
          userId: user.id,
        },
        data: {
          coverImgUrl: data.path,
        },
      });
      // delete the old file
      const { error: oldFileError } = await supabase.storage
        .from("message_app")
        .remove([`${userProfile?.coverImgUrl}`]);

      if (oldFileError) {
        return next(
          new AppError(oldFileError.message, oldFileError.status || 400),
        );
      }

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
      const user = req.user as UserTokenData;
      if (!user) return next(new AppError("User not authorized.", 401));

      const file = req.file;
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: user.id,
        },
      });
      if (!file) {
        if (userProfile?.profileImgUrl) {
          const { data, error } = await supabase.storage
            .from("message_app")
            .remove([`${userProfile?.profileImgUrl}`]);
          if (error) {
            return next(new AppError("No profile photo added,yet.", 404));
          }
          await prisma.profile.update({
            where: {
              userId: user.id,
            },
            data: {
              profileImgUrl: null,
            },
          });
          return res.status(200).json({
            success: true,
            message: "Profile image removed successfully.",
          });
        } else {
          return next(new AppError("No profile photo added,yet.", 404));
        }
      }

      const { data, error } = await supabase.storage
        .from("message_app")
        .upload(
          `${user.id}/assets/photos/profile/${file.originalname}`,
          file.buffer,
          {
            contentType: file.mimetype,
          },
        );

      if (error) {
        return next(new AppError(error.message, error.status || 400));
      }
      const updatedProfile = await prisma.profile.update({
        where: {
          userId: user.id,
        },
        data: {
          profileImgUrl: data.path,
        },
      });
      const { error: oldFileError } = await supabase.storage
        .from("message_app")
        .remove([`${userProfile?.profileImgUrl}`]);

      if (oldFileError) {
        return next(
          new AppError(oldFileError.message, oldFileError.status || 400),
        );
      }
      return res
        .status(200)
        .json({ success: true, message: "Profile image added successfully." });
    } catch (error) {
      next(error);
    }
  });
}

export async function editProfile(req: Request, res: Response) {
  const { firstName, lastName, profession, location } = req.body;
  const user = req.user as UserTokenData;
  if (!user) throw new AppError("User not authorized.", 401);

  try {
    await prisma.profile.update({
      where: {
        userId: user.id,
      },
      data: {
        firstName,
        lastName,
        profession,
        location,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025": {
          throw new AppError("User record not found.", 404);
        }
      }
    }
    throw new AppError("Unknown edit profile error", 500);
  }
}
