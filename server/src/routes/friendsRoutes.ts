import { Router } from "express";
import { prisma } from "../lib/prisma.ts";

const friendsRoute = Router();

friendsRoute.get("/people-you-may-know", (req, res) => {
  res.json({ message: "all friends" });
});

export default friendsRoute;
