import { Doctor, Prisma } from "@prisma/client";
import {
  IPaginationOptions,
  paginationHelpers,
} from "../../helpers/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../utils/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getDoctors = async (fillters: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = fillters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // "", "medicine"
  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingelDoctor = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });
  return result;
};
const deleteDoctor = async (id: string): Promise<Doctor | null> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};


const updateDoctorData = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const { specialties, ...doctorData } = payload;

  // Fetch existing doctor including specialties
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id },
    include: { doctorSpecialties: true },
  });

  if (!existingDoctor) {
    throw new Error("Doctor not found");
  }

  // Extract specialty IDs
  const existingSpecialtyIds = existingDoctor.doctorSpecialties.map(
    (ds) => ds.specialitiesId
  );

  const incomingSpecialtyIds = specialties?.map((s) => s.specialtyId) || [];

  return await prisma.$transaction(async (tx) => {
    // Update doctor fields
    await tx.doctor.update({
      where: { id },
      data: doctorData,
    });

    // Soft-delete specialties removed from input
    const toDelete = existingSpecialtyIds.filter(
      (sid) => !incomingSpecialtyIds.includes(sid)
    );

    if (toDelete.length > 0) {
      await tx.doctorSpecialties.updateMany({
        where: { doctorId: id, specialitiesId: { in: toDelete } },
        data: { isDeleted: true },
      });
    }

    // Upsert (create/update) specialties
    if (specialties && specialties.length > 0) {
      for (const sp of specialties) {
        await tx.doctorSpecialties.upsert({
          where: {
            specialitiesId_doctorId: {
              specialitiesId: sp.specialtyId,
              doctorId: id,
            },
          },
          update: {
            isDeleted: sp.isDeleted ?? false,
          },
          create: {
            specialitiesId: sp.specialtyId,
            doctorId: id,
            isDeleted: sp.isDeleted ?? false,
          },
        });
      }
    }

    // Return updated doctor with non-deleted specialties
    return tx.doctor.findUnique({
      where: { id },
      include: {
        doctorSpecialties: {
          where: { isDeleted: false },
          include: { specialities: true },
        },
      },
    });
  });
};


  
export const DoctorService = {
  getDoctors,
  getSingelDoctor,
  deleteDoctor,
  updateDoctorData,
};
