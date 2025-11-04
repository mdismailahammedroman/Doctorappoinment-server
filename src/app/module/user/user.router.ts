import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.contoller";
import { filUploder } from "../../helpers/fileUploder";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";

const router = Router();

router.post(
  "/createuser",
  filUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      UserValidationSchema.createPatientValidationSchema.parse(req.body);

      next(); 
    } catch (error) {
      return next(error); 
    }
  },
  UserController.createUser
);

export const UserRouter = router;
