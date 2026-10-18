import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import {
  getParticipants,
  addConversationMessage,
} from "../controllers/conversationController.ts";
import { prisma } from "../lib/prisma.ts";
import { validateBody } from "../middlewares/validation.ts";
import { ConversationIdSchema } from "../utils/zodSchemas/index.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", addConversationMessage);

conversationRoute.get(
  "/:conversationId/messages",
  validateBody(ConversationIdSchema),
  async (req, res) => {
    const { conversationId } = req.body;
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversation_id: conversationId,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      console.log(messages);
      return res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {}
  },
);

export default conversationRoute;
