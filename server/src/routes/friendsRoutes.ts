import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import passport from "passport";
import type { UserTokenData } from "../types/user.ts";

const friendsRoute = Router();

friendsRoute.use(passport.authenticate("jwt", { session: false }));

friendsRoute.get("/people-you-may-know", async (req, res) => {
  const loggedInUser = req.user as UserTokenData;
  if (!loggedInUser) {
    return res.json({
      message: "User not logged in",
    });
  }
  const cursor = req.query.cursor;
  const fetchFriendsLimit = 10;
  try {
    const friends = await prisma.user.findMany({
      where: {
        id: {
          not: loggedInUser.id,
        },
        ...(cursor && {
          created_at: {
            gte: new Date(String(cursor)),
          },
        }),
      },
      orderBy: [
        {
          created_at: "asc",
          id: "asc",
        },
      ],
      take: fetchFriendsLimit + 1,
    });
    const hasMore = friends.length > fetchFriendsLimit;

    const friendsList = hasMore
      ? friends.splice(0, fetchFriendsLimit)
      : friends;

    const nextCursor = hasMore ? friends[friends.length - 1].created_at : null;

    return res.json({
      success: true,
      friends: friendsList,
      nextCursor,
    });
  } catch (error) {}
});

export default friendsRoute;
