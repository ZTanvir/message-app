import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import {
  getParticipants,
  addConversationMessage,
} from "../controllers/conversationController.ts";
import { prisma } from "../lib/prisma.ts";
import { validateParams } from "../middlewares/validation.ts";
import { ConversationIdSchema } from "../utils/zodSchemas/index.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import AppError from "../utils/appError.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", addConversationMessage);

conversationRoute.get(
  "/:conversationId/messages",
  validateParams(ConversationIdSchema),
  async (req, res) => {
    const { conversationId } = req.params;
    const { lastLoadedMsgCreatedAt } = req.query;
    const limit = 10;
    try {
      const rows = await prisma.message.findMany({
        where: {
          conversation_id: Number(conversationId),
          ...(lastLoadedMsgCreatedAt && {
            created_at: {
              lt: new Date(lastLoadedMsgCreatedAt as string),
            },
          }),
        },
        orderBy: [
          {
            created_at: "desc",
          },
          { id: "desc" },
        ],
        take: limit + 1,
      });
      const hasMore = rows.length > limit;
      const messages = hasMore ? rows.slice(0, limit) : rows;
      const nextCursor = hasMore ? rows[rows.length - 1].conversation_id : null;

      return res.status(200).json({
        success: true,
        conversations: messages.toReversed(),
        hasMore,
        nextCursor,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError("Db query known error", Number(error.code));
      }
      throw new AppError("Db error", 500);
    }
  },
);

export default conversationRoute;
