import express from "express";
import { DoctorController } from "./doctor.controller";


const router = express.Router();

router.get(
    "/",
    DoctorController.getAllDoctor
);
router.get("/:id",DoctorController.getSingelDoctor)
export const DoctorRoutes = router;