// user.controller.ts
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import StatusCodes from "http-status";
import { UserServices } from "./user.service";
import { userFilterableFields } from "./user.constant";
import pick from "../../helpers/pick";

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

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, userFilterableFields); // { role: 'doctor' }
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserServices.getAllUser(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});


export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
};
