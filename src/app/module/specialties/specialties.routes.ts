import { NextFunction, Request, Response, Router } from "express";
import { filUploder } from "../../helpers/fileUploder";
import { SpecialtiesValidtaion } from "./specialties.validation";
import { specialtiesController } from "./specialties.controller";


const router=Router()

router.post(
    '/',
    filUploder.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data))
        return specialtiesController.createSpecialtie(req, res, next)
    }
);

export const SpecialtiesRoutes=router