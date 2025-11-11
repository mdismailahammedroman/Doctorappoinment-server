import { Router } from "express";
import { doctorScheduleController } from "./DoctorSchedule.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  doctorScheduleController.insertInTodb
);

router.get(
  "/my-schedule",
  checkAuth(UserRole.DOCTOR),
  doctorScheduleController.getMySchedule
);
export const doctorSchedule = router;
