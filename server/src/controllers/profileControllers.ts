import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import AppError from "../utils/appError.ts";

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
