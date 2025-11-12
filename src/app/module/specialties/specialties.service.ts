import { Request } from "express";
import { prisma } from "../../utils/prisma";
import httpStatus from "http-status";
import { filUploder } from "../../helpers/fileUploder";
import { AppError } from "../../helpers/errorHelpers";
import { Specialties } from "@prisma/client";

const createSpecialty = async (req: Request) => {
  try {
    const file = req.file;
    let iconUrl: string | undefined;

//     const specialties = [
//   "Cardiology", "Neurology", "Dermatology", "Orthopedics", "Pediatrics",
//   "Psychiatry", "General Surgery", "Urology", "Gastroenterology", "Endocrinology",
//   "Pulmonology", "Ophthalmology", "ENT", "Obstetrics & Gynecology", "Rheumatology",
//   "Nephrology", "Oncology", "Hematology", "Anesthesiology", "Infectious Diseases"
// ];
    // ✅ Upload image to Cloudinary (if file provided)
    if (file) {
      const uploadResult = await filUploder.uploadToCloudinary(file);
      iconUrl = uploadResult?.secure_url;
    }

    const { title } = req.body;

    if (!title) {
      throw new AppError(httpStatus.BAD_REQUEST, "Title is required for specialty");
    }

    const result = await prisma.specialties.create({
      data: {
        title,
        icon: iconUrl || "", // default empty string if no file
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};
const getAllFromDB = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
}

const deleteFromDB = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};

export const SpecialtiesService = {
  createSpecialty,
   getAllFromDB,
    deleteFromDB
};
