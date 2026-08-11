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
      console.log("new user", newUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return { success: false, message: "Email already exists." };
        }
      }
    }
    res.json("auth signup route");
  },
);
authRoute.post("/login", validateBody(LoginValidationSchema), loginController);

export default authRoute;
