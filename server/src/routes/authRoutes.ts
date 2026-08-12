import { Router } from "express";
import { loginController } from "../controllers/authControllers.ts";
import { validateBody } from "../middlewares/validation.ts";
import {
  LoginValidationSchema,
  SignUpValidationSchema,
} from "@message-app/shared/zodSchemas/validationSchema.ts";
import { prisma } from "../lib/prisma.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import bcrypt from "bcryptjs";
import passport from "passport";
import env from "../../env.ts";
import jwt from "jsonwebtoken";

const authRoute = Router();

authRoute.post(
  "/signup",
  validateBody(SignUpValidationSchema),
  async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          hashPassword,
          profile: {
            create: { firstName: first_name, lastName: last_name },
          },
        },
        include: {
          profile: true,
        },
      });
      const token = jwt.sign({}, env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return { success: false, message: "Email already exists." };
        }
      }
      return {
        success: false,
        message: "Use registration failed,please try again.",
      };
    }
  },
);
authRoute.post("/login", validateBody(LoginValidationSchema), loginController);

authRoute.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Auth done", use: req.user });
  },
);

export default authRoute;
