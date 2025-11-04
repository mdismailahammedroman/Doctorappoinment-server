import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
     await schema.parseAsync(req.body);
      next();
    } catch (error) {
      
      next(error);
    }
  };

export default validateRequest;
