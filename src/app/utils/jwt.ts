import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { AppError } from "../helpers/errorHelpers";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
   
    throw new AppError(401, "Invalid or expired token");
  }
};