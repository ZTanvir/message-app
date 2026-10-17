import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import {
  getParticipants,
  addConversationMessage,
} from "../controllers/conversationController.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", addConversationMessage);

export default conversationRoute;
