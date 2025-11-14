import { NextFunction, Request, Response } from "express";
import pick from "../../helpers/pick";
import catchAsync from "../../utils/catchAsync";
import { doctorFilterableFields } from "./doctor.constant";
import sendResponse from "../../utils/sendResponse";
import { DoctorService } from "./doctor.service";

const getAllDoctor = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, doctorFilterableFields)

    const result = await DoctorService.getDoctors(fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data
    })
})

export const DoctorController={
    getAllDoctor,
}