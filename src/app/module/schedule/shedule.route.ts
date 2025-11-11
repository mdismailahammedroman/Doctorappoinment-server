import { UserRole } from "@prisma/client";
import checkAuth from "../../middlewares/checkAuth";
import express from 'express'
import { ScheduleController } from "./schedule.contoller";
const router = express.Router();

router.get(
    "/",
    checkAuth(UserRole.DOCTOR, UserRole.ADMIN),
    ScheduleController.schedulesForDoctor
)

router.post(
    "/",
    checkAuth(UserRole.ADMIN),
    ScheduleController.insertIntoDB
)


router.delete(
    "/:id",
    checkAuth(UserRole.ADMIN),
    ScheduleController.deleteScheduleFromDB
)
export const ScheduleRoutes = router;