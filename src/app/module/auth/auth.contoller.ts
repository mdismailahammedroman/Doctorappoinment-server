import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { authServices } from "./auth.services";
import { UserRole } from "@prisma/client";

const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const loginUser = await authServices.userLogin(req.body);
  const { accessToken, refreshToken, needPasswordChange, user } = loginUser;

  // 🍪 Set tokens as cookies
  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  // 🧠 Role-wise message
   let message = "User login successful!";
  if (user?.role === UserRole.DOCTOR) message = "Doctor login successful!";
  else if (user?.role === UserRole.ADMIN) message = "Admin login successful!";
  else if (user?.role === UserRole.PATIENT) message = "Patient login successful!";


  // 📨 Send response
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message,
    data: {
      role: user?.role,
      email: user?.email,
      needPasswordChange,
    },
  });
});

export const authController = {
  userLogin,
};
