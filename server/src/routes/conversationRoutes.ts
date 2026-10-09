import { Router } from "express";
const conversationRoute = Router();
import passport from "passport";
import { getParticipants } from "../controllers/messageControllers.ts";
import multer from "multer";
const storage = multer.memoryStorage();
const uploadMessageImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 1MB
  },
}).array("messageImage");

conversationRoute.use(passport.authenticate("jwt", { session: false }));

conversationRoute.get("/participants", getParticipants);

conversationRoute.post("/with/:userId", (req, res) => {
  uploadMessageImages(req, res, function (err) {
    const { messageType } = req.body;

    if (messageType === "TEXT") {
      const { receiverId, messageType, senderMessage } = req.body;

      return res.status(200).json({
        success: true,
      });
    } else {
      const { receiverId, messageType } = req.body;
      console.log("file body", receiverId, messageType);

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
