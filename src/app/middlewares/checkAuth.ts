import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers/errorHelpers";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/envVars";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../utils/prisma";

const checkAuth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        throw new AppError(401, "No token received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET
      ) as JwtPayload;

      if (!verifiedToken || !verifiedToken.email) {
        throw new AppError(401, "Invalid or mailformed token");
      }

      const isUserExist = await prisma.user.findFirst({
        where: { email: verifiedToken.email },
      });

      if (!isUserExist) {
        throw new AppError(404, "User not found");
      }

      // ✅ Role check
      if (roles.length > 0 && !roles.includes(isUserExist.role)) {
        throw new AppError(403, "You are not authorized to access this resource");
      }

      // ✅ Attach user to request
      (req as any).user = isUserExist;

      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
