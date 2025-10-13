import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type Location = "body" | "query" | "params";

export const validate =
  <T extends ZodSchema>(schema: T, where: Location = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[where]);
    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid request",
        details: { fieldErrors, formErrors },
      });
    }
    (req as any)[where] = result.data;
    next();
  };
