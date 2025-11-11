import { UserStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/envVars";

const userLogin = async (payload: { email: string; password: string }) => {
  // Check user existence and active status
  const LoginUser = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Check password
  const isCorrectPassword = await bcrypt.compare(payload.password, LoginUser.password);
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  // Generate tokens
  const accessToken = generateToken(
    { email: LoginUser.email, role: LoginUser.role },
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRE
  );

  const refreshToken = generateToken(
    { email: LoginUser.email, role: LoginUser.role },
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_EXPIRE,
  );

  // Return user info along with tokens
  return {
    accessToken,
    refreshToken,
    needPasswordChange: LoginUser.needPasswordChange,
    user: {
      id: LoginUser.id,
      email: LoginUser.email,
      role: LoginUser.role,
    },
  };
};

export const authServices = {
  userLogin,
};
