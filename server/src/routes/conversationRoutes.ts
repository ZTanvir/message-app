import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import { getParticipants } from "../controllers/messageControllers.ts";

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", (req, res) => {
  console.log(req.user, req.body);
  return res.status(200).json({
    success: true,
  });
});

export default conversationRoute;
