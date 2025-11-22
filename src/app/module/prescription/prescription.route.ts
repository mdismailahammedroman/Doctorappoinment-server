import { UserRole } from "@prisma/client";
import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { PrescriptionController } from "./prescription.controller";


let router=Router()

router.get("/", checkAuth(UserRole.PATIENT), PrescriptionController.CreatePrescription )

export const PrescripTionRoute=router