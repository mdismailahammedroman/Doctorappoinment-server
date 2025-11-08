import { UserRole } from "@prisma/client";
import { ScheduleContoller } from "./schedule.contoller";
import checkAuth from "../../middlewares/checkAuth";
import express from 'express'
const router = express.Router();

// router.get(
//     "/",
//     checkAuth(UserRole.DOCTOR, UserRole.DOCTOR),
//     ScheduleContoller.schedulesForDoctor
// )

router.post(
    "/",
    checkAuth(UserRole.ADMIN),
    ScheduleContoller.insertIntoDB
)


// router.delete(
//     "/:id",
//     checkAuth(UserRole.ADMIN),
//     ScheduleContoller.deleteScheduleFromDB
// )
export const ScheduleRoutes = router;