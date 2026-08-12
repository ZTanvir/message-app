import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import type { PassportStatic } from "passport";
import env from "../../env.ts";
import { prisma } from "../lib/prisma.ts";
import type { Request } from "express";

type JwtPayload = {
  sub: string;
  email: string;
};

const cookieExtractor = function (req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: env.JWT_SECRET,
};

export const setupJwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload: JwtPayload, done) {
      try {
        const user = await prisma.user.findFirst({
          where: {
            id: jwt_payload.sub,
          },
          select: {
            email: true,
          },
        });
        if (user) return done(null, user);
        return done(null, false);
      } catch (error) {
        return done(error, null);
      }
    }),
  );
};
