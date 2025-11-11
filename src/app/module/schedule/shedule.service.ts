import { addMinutes, format } from "date-fns";
import { prisma } from "../../utils/prisma";
import { IJWTPayload } from "../../../types/common";
import {
  IPaginationOptions,
  paginationHelpers,
} from "../../helpers/paginationHelpers";
import { Prisma } from "@prisma/client";

// --- Interface for schedule creation payload ---
interface ISchedulePayload {
  startDate: string; // e.g. "2026-11-10"
  endDate: string;   // e.g. "2026-11-12"
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "18:00"
}

// --- Create schedules between dates with time slots ---
const insertIntoDB = async (payload: ISchedulePayload) => {
  const { startTime, endTime, startDate, endDate } = payload;
  const intervalTime = 90; // minutes
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      `${format(currentDate, "yyyy-MM-dd")}T${startTime}:00`
    );
    const endDateTime = new Date(
      `${format(currentDate, "yyyy-MM-dd")}T${endTime}:00`
    );

    let currentSlotStart = new Date(startDateTime);

    while (currentSlotStart < endDateTime) {
      const slotStartDateTime = new Date(currentSlotStart);
      const slotEndDateTime = addMinutes(slotStartDateTime, intervalTime);

      // Avoid duplicates
      const existingSchedule = await prisma.schedule.findFirst({
        where: { startDateTime: slotStartDateTime, endDateTime: slotEndDateTime },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: { startDateTime: slotStartDateTime, endDateTime: slotEndDateTime },
        });
        schedules.push(result);
      }

      currentSlotStart = addMinutes(currentSlotStart, intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

// --- Fetch available schedules for a doctor ---
const schedulesForDoctor = async (
  user: IJWTPayload,
  filters: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filters.startDateTime && filters.endDateTime) {
    const filterStartDateTime = new Date(filters.startDateTime);
    const filterEndDateTime = new Date(filters.endDateTime);

    andConditions.push({
      AND: [
        { startDateTime: { gte: filterStartDateTime } },
        { endDateTime: { lte: filterEndDateTime } },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Get all schedules that the doctor already has assigned
  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: { doctor: { email: user.email } },
    select: { scheduleId: true },
  });

  const doctorScheduleIds = doctorSchedules.map((s) => s.scheduleId);

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: { notIn: doctorScheduleIds },
    },
    skip,
    take: limit,
    orderBy: { [sortBy || "startDateTime"]: sortOrder || "asc" },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: { notIn: doctorScheduleIds },
    },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const deleteScheduleFromDB = async (id: string) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    })
}

export const ScheduleService = {
    insertIntoDB,
    schedulesForDoctor,
    deleteScheduleFromDB
}