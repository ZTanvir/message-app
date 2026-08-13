import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import env from "../../env.ts";
import jwt from "jsonwebtoken";
import { Prisma } from "../../prisma/generated/prisma/client.ts";

export function loginController(req: Request, res: Response) {
  const formData = req.body;
  res.json(formData);
}
export async function signupController(req: Request, res: Response) {
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
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
        return res
          .status(400)
          .json({ success: false, message: "Email already exists." });
      }
    }
    return res.status(400).json({
      success: false,
      message: "Use registration failed,please try again.",
    });
  }
}
