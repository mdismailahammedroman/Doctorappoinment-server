import { Router } from "express";
import { authContoller } from "./auth.contoller";


const router=Router();

router.use("/login", authContoller.userLogin)

export const authRoute=router