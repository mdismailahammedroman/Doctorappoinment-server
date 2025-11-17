import { UserRole } from "@prisma/client";
import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { AppoinmentController } from "./appointment.controller";


let route=Router()

route.post("/",checkAuth(UserRole.PATIENT), AppoinmentController.createAppoinment)

export const AppoinmentRouter=route