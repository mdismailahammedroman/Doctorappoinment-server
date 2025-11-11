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

router.delete('/:id',checkAuth(UserRole.DOCTOR),doctorScheduleController.deleteFromDB)
router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    doctorScheduleController.getAllFromDB
);
export const doctorSchedule = router;
