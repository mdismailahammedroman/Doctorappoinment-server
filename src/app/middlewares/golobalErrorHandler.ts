import { NextFunction, Request, Response } from "express";
import  HttpStatus  from "http-status";

const golobalErrorHandler=(err:any, req:Request, res:Response, next:NextFunction)=>{
 let statusCode=HttpStatus.INTERNAL_SERVER_ERROR;
 let success= false;
 let message= err.message || "something went wrong !";
 let error=err
 res.send(statusCode).json({
    success,
    message,
    error,
 })
}
export default golobalErrorHandler