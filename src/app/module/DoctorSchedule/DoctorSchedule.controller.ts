import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJWTPayload } from "../../../types/common";
import { doctorScheduleService } from "./DoctorSchedule.service";

const insertInTodb = catchAsync(
  async (req: Request & {user?:IJWTPayload}, res: Response, next: NextFunction) => {
    const user=req.user
    const result = await doctorScheduleService.insertInTodb(user as IJWTPayload, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctor Schedule created successfully!",
      data: result,
    });
  }
);

export const doctorScheduleController={
    insertInTodb
}