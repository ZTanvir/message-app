import type { Request, Response } from "express";

export function loginController(req: Request, res: Response) {
  const formData = req.body;
  res.json(formData);
}
