import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export const validate =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => {
          const fieldPath = issue.path.join(".");
          return {
            field: fieldPath,
            message: issue.message,
            code: issue.code,
          };
        });
        
        return res.status(400).json({
          message: "Validation failed",
          errors: formattedErrors,
        });
      }
      
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };