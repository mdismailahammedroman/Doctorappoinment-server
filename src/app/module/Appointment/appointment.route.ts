import { UserRole } from "@prisma/client";
import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { AppoinmentController } from "./appointment.controller";


let router=Router()

router.post("/",checkAuth(UserRole.PATIENT), AppoinmentController.createAppoinment)
router.get(
    "/my-appointments",
    checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
    AppoinmentController.getMyAppointment
)
router.patch( "/status/:id", checkAuth(UserRole.DOCTOR, UserRole.ADMIN), AppoinmentController.updateAppointmentStatus)
export const AppoinmentRouter=router