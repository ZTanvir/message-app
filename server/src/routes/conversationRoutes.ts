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

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", (req, res) => {
  uploadMessageImages(req, res, async function (err) {
    const { messageType, receiverId } = req.body;
    const logInUser = req.user as UserTokenData;
    const participants = [logInUser?.id, receiverId].sort().join(":");

    if (messageType === "TEXT") {
      const { senderMessage } = req.body;
      console.log("text", participants);

      try {
      } catch (error) {}

      return res.status(200).json({
        success: true,
      });
    } else {
      console.log("file body", participants);

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
