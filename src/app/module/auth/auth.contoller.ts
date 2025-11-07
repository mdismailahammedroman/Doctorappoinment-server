import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { authServices } from "./auth.services";


const userLogin=catchAsync(async(req:Request, res:Response,next:NextFunction)=>{

    const loginUser= await authServices.userLogin(req.body)
    const {accessToken, refreshToken,needPasswordChange}=loginUser;
    res.cookie("accessToken",accessToken,
        {
            secure:true,
            
            httpOnly:true,
            sameSite:"none",
            maxAge:1000*60*60
        }
    )
    res.cookie("refreshToken",refreshToken,
        {
            secure:true,
            httpOnly:true,
            sameSite:"none",
            maxAge:1000*60*60
        }
    )

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"user login Successfully",
        data:{
            needPasswordChange
        },

    })
})

export const authContoller={
    userLogin
}