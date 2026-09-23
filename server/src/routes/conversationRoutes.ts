import { Router } from "express";
const conversationRoute = Router();
import { prisma } from "../lib/prisma.ts";

conversationRoute.get("/participants", async (req, res) => {
  //   get all users expect login
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {}
});

export default conversationRoute;
