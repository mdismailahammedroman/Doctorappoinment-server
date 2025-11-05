// user.service.ts
import { Request } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { filUploder } from "../../helpers/fileUploder";
import { envVars } from "../../config/envVars";
import { IPaginationOptions, paginationHelpers } from "../../helpers/paginationHelpers";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";

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

const getAllUser = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (filterData.role) {
    filterData.role = String(filterData.role).toUpperCase();
  }
  if (filterData.status) {
    filterData.status = String(filterData.status).toUpperCase();
  }

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}


export const UserServices = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
};
