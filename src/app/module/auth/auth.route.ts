import { Router } from "express";
import { authController } from "./auth.contoller";


const router=Router();

router.use("/login", authController.userLogin)

export const authRoute=router