import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import AppError from "../utils/appError.ts";
import type { UserTokenData } from "../types/user.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";

export async function getParticipants(req: Request, res: Response) {
  const loggedInUser = req.user as UserTokenData;
  if (!loggedInUser) throw new AppError("User not authenticated", 401);

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          // user don't message with his
          id: loggedInUser.id,
        },
      },
      select: {
        email: true,
        id: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            profileImgUrl: true,
          },
        },
      },
    });
    const usersWithMessage = [];
    for (const user of users) {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { sender_id: user.id },
            {
              sender_id: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          body: true,
          type: true,
          sender_id: true,
          receiver_id: true,
        },
      });
      usersWithMessage.push({ ...user, lastMessage });
    }

    return res.status(200).json({
      success: true,
      users: usersWithMessage,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025": {
          throw new AppError("User record not found.", 404);
        }
      }
    }
    throw new AppError("Unknown edit profile.", 500);
  }
}
