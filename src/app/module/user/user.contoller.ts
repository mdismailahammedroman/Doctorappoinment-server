import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import StatusCodes from "http-status";
import { UserServices } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req);
    // console.log("Created user:", req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User and Patient created successfully",
      data: result,
    });
  }
);


export const UserController = {
  createUser,
};
