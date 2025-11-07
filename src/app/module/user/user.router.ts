import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.contoller";
import { filUploder } from "../../helpers/fileUploder";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/createpatient",
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
  UserController.createPatient
);
router.post(
  "/createdoctor",
  filUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      UserValidationSchema.createDoctorValidationSchema.parse(req.body);

      next(); 
    } catch (error) {
      return next(error); 
    }
  },
  UserController.createDoctor
);
router.post(
  "/createadmin",
  filUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }

      UserValidationSchema.createAdminValidationSchema.parse(req.body);

      next();
    } catch (error) {
      return next(error);
    }
  },
  UserController.createAdmin
);

router.get("/", checkAuth(UserRole.DOCTOR,UserRole.ADMIN), UserController.getAllUser)

export const UserRouter = router;
