// user.controller.ts
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import StatusCodes from "http-status";
import { UserServices } from "./user.service";

const createPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.createPatient(req);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.createDoctor(req);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Doctor created successfully",
    data: result,
  });
});


const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.createAdmin(req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});


export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
};
