// user.service.ts
import { Request } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { filUploder } from "../../helpers/fileUploder";
import { envVars } from "../../config/envVars";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadResult = await filUploder.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, Number(envVars.SALTROUND));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
        role: "PATIENT",
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

const createDoctor = async (req: Request) => {
  if (req.file) {
    const uploadResult = await filUploder.uploadToCloudinary(req.file);
    req.body.doctor.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, Number(envVars.SALTROUND));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashPassword,
        role: "DOCTOR",
      },
    });

    return await tnx.doctor.create({
      data: req.body.doctor,
    });
  });

  return result;
};


const createAdmin = async (req: Request) => {
  if (req.file) {
    const uploadResult = await filUploder.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, Number(envVars.SALTROUND));

  const result = await prisma.$transaction(async (tnx) => {
    //  Create user with role = ADMIN
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: "ADMIN",
      },
    });

    // 2️⃣ Create admin record
    return await tnx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};


export const UserServices = {
  createPatient,
  createDoctor,
  createAdmin,
};
