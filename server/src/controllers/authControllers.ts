import type { Request, Response } from "express";

export function loginController(req: Request, res: Response) {
  res.json("login successfully");
}
