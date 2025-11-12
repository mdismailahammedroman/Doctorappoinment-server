import { Request } from "express";
import { prisma } from "../../utils/prisma";
import httpStatus from "http-status";
import { filUploder } from "../../helpers/fileUploder";
import { AppError } from "../../helpers/errorHelpers";

const createSpecialty = async (req: Request) => {
  try {
    const file = req.file;
    let iconUrl: string | undefined;

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

export const SpecialtiesService = {
  createSpecialty,
};
