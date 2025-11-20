import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import {  AppointmentService } from "./appointment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IJWTPayload } from "../../../types/common";
import pick from "../../helpers/pick";

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

const getMyAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["status", "paymentStatus"])
    const user = req.user;
    const result = await AppointmentService.getMyAppointment(user as IJWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment fetched successfully!",
        data: result
    })
})

const updateAppointmentStatus = catchAsync(
  async (
    req: Request & { user?: IJWTPayload }, res: Response, next: NextFunction )=> {
      const user = req.user;
      const appointmentId = req.params.id;
      const status = req.body.status;
      const result = await AppointmentService.updateAppointmentStatus(appointmentId, status, user as IJWTPayload);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Appointment status updated successfully",
        data: result,
      });
    }
);

export const AppoinmentController = {
  createAppoinment,
  getMyAppointment,
  updateAppointmentStatus,
};
