import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import env from "../../env.ts";
import { Prisma } from "../../prisma/generated/prisma/client.ts";
import { generateJwt } from "../utils/authentication.ts";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = generateJwt(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      "7d",
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
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
    const token = generateJwt(
      { id: newUser.id, email: newUser.email },
      env.JWT_SECRET,
      "7d",
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "Registration complete!",
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
