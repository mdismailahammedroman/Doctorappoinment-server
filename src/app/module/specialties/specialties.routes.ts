import { NextFunction, Request, Response, Router } from "express";
import { filUploder } from "../../helpers/fileUploder";
import { SpecialtiesValidtaion } from "./specialties.validation";
import { specialtiesController } from "./specialties.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";


const router=Router()

router.post(
    '/',
    filUploder.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data))
        return specialtiesController.createSpecialtie(req, res, next)
    }
);

router.get(
    '/',
    specialtiesController.getAllFromDB
);

router.delete(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.ADMIN),
    specialtiesController.deleteFromDB
);

export const SpecialtiesRoutes=router