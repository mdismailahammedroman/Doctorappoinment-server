import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { SpecialtiesService } from "./specialties.service";


const createSpecialtie = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const result = await SpecialtiesService.createSpecialtie(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});
export const specialtiesController={
    createSpecialtie
}
