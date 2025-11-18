import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import {  AppointmentService } from "./appointment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IJWTPayload } from "../../../types/common";

const createAppoinment = catchAsync(
  async (
    req: Request & { user?: IJWTPayload },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IJWTPayload,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appoinment create successfuly",
      data: result,
    });
  }
);
export const AppoinmentController = {
  createAppoinment,
};
