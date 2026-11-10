import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import {
  getParticipants,
  addConversationMessage,
  conversationMessage,
} from "../controllers/conversationController.ts";
import { validateParams } from "../middlewares/validation.ts";
import { ConversationIdSchema } from "../utils/zodSchemas/index.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", addConversationMessage);

conversationRoute.get(
  "/:conversationId/messages",
  validateParams(ConversationIdSchema),
  conversationMessage,
);

export default conversationRoute;
