import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationData = {
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
      };

      schema.parse(validationData);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => {
          const fieldPath = issue.path.slice(1).join(".");
          const section = issue.path[0];

          return {
            field: fieldPath || section,
            section: section,
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
