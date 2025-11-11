import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJWTPayload } from "../../../types/common";
import { doctorScheduleService } from "./DoctorSchedule.service";
import pick from "../../helpers/pick";
import status from "http-status";

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

const getMySchedule=catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user as IJWTPayload;

    const result = await doctorScheduleService.getMySchedule(
      user,
      filters,
      options
    );
    sendResponse(res,({
        success:true,
        statusCode:status.OK,
         message: "My Schedule fetched successfully!",
        data: result
    }))
})

export const doctorScheduleController={
    insertInTodb,
    getMySchedule
}