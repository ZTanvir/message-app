import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import AppError from "../utils/appError.ts";
import type { UserTokenData } from "../types/user.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import multer from "multer";
import supabase from "../lib/supabase.ts";
const storage = multer.memoryStorage();
const uploadMessageImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 5,
  },
}).array("messageImage");

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
            { sender_id: user.id, receiver_id: loggedInUser.id },
            {
              sender_id: loggedInUser.id,
              receiver_id: user.id,
            },
          ],
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          body: true,
          type: true,
          conversation_id: true,
          sender_id: true,
          receiver_id: true,
          created_at: true,
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
export async function addConversationMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadMessageImages(req, res, async function (err) {
    const { messageType, receiverId } = req.body;
    const logInUser = req.user as UserTokenData;
    if (!logInUser?.id)
      return res.json(401).json({
        message: "Unauthorize user.",
      });
    const [user1Id, user2Id] = [logInUser.id, receiverId].sort();

    if (messageType === "TEXT") {
      const { senderMessage } = req.body;

      try {
        const result = await prisma.$transaction(async (tx) => {
          const conversation = await tx.conversation.upsert({
            where: {
              user1Id_user2Id: {
                user1Id,
                user2Id,
              },
            },
            update: {},
            create: {
              user1Id,
              user2Id,
            },
          });
          const message = await tx.message.create({
            data: {
              conversation_id: conversation.id,
              sender_id: logInUser.id,
              receiver_id: receiverId,
              type: "TEXT",
              body: senderMessage,
            },
          });
          return {
            conversation_id: conversation.id,
            sender_id: message.sender_id,
          };
        });
        return res.status(200).json({
          success: true,
          message: "Conversation created.",
          type: "TEXT",
          data: result,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new AppError("Conversation already exists.", 409);
          }
        }
        throw new AppError("Unknown create conversation message.", 500);
      }
    } else {
      if (!req.files || req.files.length === 0)
        return next(new AppError("Please add file.", 400));

      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            return next(new AppError("Max image size is 2MB", 400));
          case "LIMIT_FILE_COUNT":
            return next(new AppError("Maximum 5 files allowed.", 400));
        }
      } else if (err) {
        return next(new AppError("Unknown file upload error.", 400));
      }
      const files = req.files;

      try {
        const result = await prisma.$transaction(async (tx) => {
          const conversation = await tx.conversation.upsert({
            where: {
              user1Id_user2Id: {
                user1Id,
                user2Id,
              },
            },
            update: {},
            create: {
              user1Id,
              user2Id,
            },
          });
          // store conversation images
          if (Array.isArray(files)) {
            for (const loadedFile of files) {
              const { data, error } = await supabase.storage
                .from("message_app")
                .upload(
                  `/conversation/${conversation.id}/assets/photos/${loadedFile.originalname}`,
                  loadedFile.buffer,
                  {
                    contentType: loadedFile.mimetype,
                    upsert: true,
                  },
                );
              if (error) {
                throw new Error("File upload error.");
              }

              const message = await tx.message.create({
                data: {
                  conversation_id: conversation.id,
                  sender_id: logInUser.id,
                  receiver_id: receiverId,
                  type: "FILE",
                  body: data.path,
                },
              });
            }
          }
          return {
            conversation_id: conversation.id,
            sender_id: logInUser,
          };
        });
        return res.status(200).json({
          success: true,
          message: "Files uploaded.",
          type: "FILE",
          data: result,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new AppError("Conversation already exists.", 409);
          }
        }
        throw new AppError("Unknown create conversation message.", 500);
      }
    }
  });
}
