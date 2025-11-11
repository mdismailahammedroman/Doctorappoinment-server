import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJWTPayload } from "../../../types/common";
import pick from "../../helpers/pick";
import httpStatus from "http-status";
import { DoctorScheduleService } from "./DoctorSchedule.service";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

const insertInTodb = catchAsync(
  async (req: Request & {user?:IJWTPayload}, res: Response, next: NextFunction) => {
    const user=req.user
    const result = await DoctorScheduleService.insertInTodb(user as IJWTPayload, req.body);

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

    const result = await DoctorScheduleService.getMySchedule(
      user,
      filters,
      options
    );
    sendResponse(res,({
        success:true,
        statusCode:httpStatus.OK,
         message: "My Schedule fetched successfully!",
        data: result
    }))
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await DoctorScheduleService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
export const doctorScheduleController={
    insertInTodb,
    getMySchedule,
    getAllFromDB
}