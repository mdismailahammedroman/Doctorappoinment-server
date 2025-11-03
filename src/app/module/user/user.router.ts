import { Router } from "express";
import { UserController } from "./user.contoller";

const router = Router();

router.post("/createuser", UserController.createUser)

export const UserRouter=router