import { UserStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/envVars";

const userLogin = async (payload: { email: string; password: string }) => {
  const LoginUser = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    LoginUser.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }
  const accessToken = generateToken(
    { email: LoginUser.email, role: LoginUser.role },
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRE
  );
  const refreshToken = generateToken(
    { email: LoginUser.email, role: LoginUser.role },
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_EXPIRE
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: LoginUser.needPasswordChange,
  };
};
export const authServices = {
  userLogin,
};
