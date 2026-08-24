import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import AppError from "../utils/appError.ts";

export async function getProfile(req: Request, res: Response) {
  const { userId } = req.params;
  if (!userId) throw new AppError("User id not found", 404);

  const normalizeUserId = Array.isArray(userId)
    ? (userId[0] ?? undefined)
    : (userId ?? undefined);

  const user = await prisma.profile.findUnique({
    where: { userId: normalizeUserId },
  });
  return res.status(200).json({ data: user });
}
