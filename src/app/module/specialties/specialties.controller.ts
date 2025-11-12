import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { SpecialtiesService } from "./specialties.service";


const createSpecialtie = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const result = await SpecialtiesService.createSpecialty(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.getAllFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialties data fetched successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});

export const specialtiesController={
    createSpecialtie,
     getAllFromDB,
    deleteFromDB
}
