import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import pick from "../../helpers/pick";
import { IJWTPayload } from "../../../types/common";
import { ScheduleService } from "./shedule.service";

// --- Create new schedules ---
const insertIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Schedule created successfully!",
      data: result,
    });
  }
);

// --- Fetch schedules for doctor ---
const schedulesForDoctor = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user as IJWTPayload;

    const result = await ScheduleService.schedulesForDoctor(
      user,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    })
})


export const ScheduleController = {
    insertIntoDB,
    schedulesForDoctor,
    deleteScheduleFromDB
}