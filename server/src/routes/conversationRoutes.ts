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
  },
}).array("messageImage");
import { prisma } from "../lib/prisma.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import AppError from "../utils/appError.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", (req, res) => {
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
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
      } else if (err) {
        // An unknown error occurred when uploading.
      }
    }

    // Everything went fine.
    return res.status(200).json({
      success: true,
    });
  });
});

export default conversationRoute;
