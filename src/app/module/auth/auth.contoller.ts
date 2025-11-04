import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { authServices } from "./auth.services";


const userLogin=catchAsync(async(req:Request, res:Response,next:NextFunction)=>{

    const loginUser= await authServices.userLogin(req.body)

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"user login Successfully",
        data:loginUser,

    })
})

export const authContoller={
    userLogin
}