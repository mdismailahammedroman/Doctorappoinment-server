import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { IJWTPayload } from "../../../types/common";
import { prescriptionService } from "./prescription.service";


const CreatePrescription=catchAsync(async(req: Request & { user?: IJWTPayload }, res:Response,next:NextFunction)=>{
       const user = req.user;
    const result=await prescriptionService.CreatePrescription( user as IJWTPayload, req.body)
    res.status(200).json({
        success:true,
        message:"Prescription created successfully",
        data:result,
    })
})

export const PrescriptionController={
    CreatePrescription,
}