import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import { getParticipants } from "../controllers/messageControllers.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

export default conversationRoute;
