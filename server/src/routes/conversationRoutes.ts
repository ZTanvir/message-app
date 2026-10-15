import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import { getParticipants } from "../controllers/conversationController.ts";
import multer from "multer";
import type { UserTokenData } from "../types/user.ts";
const storage = multer.memoryStorage();
const uploadMessageImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 5,
  },
}).array("messageImage");
import { prisma } from "../lib/prisma.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import AppError from "../utils/appError.ts";
import supabase from "../lib/supabase.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", (req, res, next) => {
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
        console.log(err.message);

        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(new AppError("Unknown file upload error.", 400));
      }
      const files = req.files;

      // try {
      //   const result = await prisma.$transaction(async (tx) => {
      //     const conversation = await tx.conversation.upsert({
      //       where: {
      //         user1Id_user2Id: {
      //           user1Id,
      //           user2Id,
      //         },
      //       },
      //       update: {},
      //       create: {
      //         user1Id,
      //         user2Id,
      //       },
      //     });

      //     const message = await tx.message.create({
      //       data: {
      //         conversation_id: conversation.id,
      //         sender_id: logInUser.id,
      //         receiver_id: receiverId,
      //         type: "FILE",
      //         body: "",
      //       },
      //     });
      //     return {
      //       conversation_id: conversation.id,
      //       sender_id: message.sender_id,
      //     };
      //   });
      //   return res.status(200).json({
      //     success: true,
      //     message: "Conversation created.",
      //     data: result,
      //   });
      // } catch (error) {
      //   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //     if (error.code === "P2002") {
      //       throw new AppError("Conversation already exists.", 409);
      //     }
      //   }
      //   throw new AppError("Unknown create conversation message.", 500);
      // }
    }
  });
});

export default conversationRoute;
