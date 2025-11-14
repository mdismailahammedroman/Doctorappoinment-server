import { Prisma } from "@prisma/client"
import { IPaginationOptions, paginationHelpers } from "../../helpers/paginationHelpers"
import { doctorSearchableFields } from "./doctor.constant"
import { prisma } from "../../utils/prisma";

const getDoctors=async(fillters:any, options:IPaginationOptions)=>{
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = fillters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // "", "medicine"
  if (specialties && specialties.length > 0) {
  andConditions.push({
    doctorSpecialties: {
      some: {
        specialities: {
          title: {
            contains: specialties,
            mode: "insensitive"
          }
        }
      }
    }
  })
}

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            },
            reviews: {
                select: {
                    rating: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

export const DoctorService={
    getDoctors
}