import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScheduleService } from "./shedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const result = await ScheduleService.insertIntoDB(req.body);
    console.log(result);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: "result"
    })
});

export const ScheduleContoller={
    insertIntoDB
}