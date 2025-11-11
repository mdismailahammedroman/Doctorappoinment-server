import { email } from "zod"
import { IJWTPayload } from "../../../types/common"
import { prisma } from "../../utils/prisma"
import { IPaginationOptions, paginationHelpers } from "../../helpers/paginationHelpers"
import { Prisma } from "@prisma/client"


const insertInTodb=async(user:IJWTPayload,payload:{
    scheduleIds:string[]
})=>{
    const doctorData= await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })
    const doctorScheduleData=payload.scheduleIds.map(scheduleId=>({
        doctorId:doctorData.id,
        scheduleId
    }))

      return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });
}


const getMySchedule = async (
   user: IJWTPayload,
  filters: any,
  options: IPaginationOptions
) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {

        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }

        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.doctorSchedules.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {

                }
    });
    const total = await prisma.doctorSchedules.count({
        where: whereConditions
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

export const doctorScheduleService={
    insertInTodb,
    getMySchedule,

}