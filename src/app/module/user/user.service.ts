import { Request } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { filUploder } from "../../helpers/fileUploder";
import { envVars } from "../../config/envVars";

const createUser = async (req: Request) => {
  if (req.file) {
    const uploadResult = await filUploder.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(envVars.SALTROUND)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });
    return await tnx.patient.create({
      data: req.body.patient,
    });
  });
  return result;
};

export const UserServices = {
  createUser,
};
