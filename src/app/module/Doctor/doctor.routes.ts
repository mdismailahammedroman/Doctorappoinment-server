import express from "express";
import { DoctorController } from "./doctor.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";


const router = express.Router();

router.get(
    "/",
    DoctorController.getAllDoctor
);
router.get("/:id",DoctorController.getSingelDoctor)
router.get("/:id",checkAuth(UserRole.ADMIN), DoctorController.deleteDoctor)
router.patch("/:id",checkAuth(UserRole.DOCTOR,UserRole.ADMIN), DoctorController.updateDoctorData)
export const DoctorRoutes = router;