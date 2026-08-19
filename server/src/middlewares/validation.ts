import type { Request, Response, NextFunction } from "express";
import z from "zod";

export function validateBody<T extends z.ZodType>(schema: T) {
  return function loginValidation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatErrors = z.flattenError(result.error);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: formatErrors.fieldErrors,
      });
    } else {
      req.body = result.data;
      next();
    }
  };
}
