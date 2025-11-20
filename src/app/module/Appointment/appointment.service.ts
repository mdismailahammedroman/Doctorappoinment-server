import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../../types/common";
import { stripe } from "../../helpers/stripe";
import { prisma } from "../../utils/prisma";
import { v4 as uuid } from "uuid";
import { IPaginationOptions, paginationHelpers } from "../../helpers/paginationHelpers";
import app from "../../../app";


const createAppointment = async (
  user: IJWTPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: { email: user.email },
  });

  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: { id: payload.doctorId, isDeleted: false },
  });

  const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuid();

  const { appointmentData, paymentData } = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: { isBooked: true },
    });

    const transactionId = uuid();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return { appointmentData, paymentData };
  });

  //  Stripe checkout session outside transaction
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Appointment with ${doctorData.name}`,
          },
          unit_amount: doctorData.appointmentFee * 100, // convert to paisa
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointmentData.id,
      paymentId: paymentData.id,
    },
    success_url: `https://www.programming-hero.com/`,
    cancel_url: `https://next.programming-hero.com/`,
  });

  return { paymentUrl: session.url };
};

const getMyAppointment=async (user: IJWTPayload, filters: any, options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const { ...filterData } = filters;
    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user.email
            }
        })
    }
    else if (user.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user.role === UserRole.DOCTOR ?
            { patient: true } : { doctor: true }
    });

    const total = await prisma.appointment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            limit,
            page
        },
        data: result
    }

}


const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus, user: IJWTPayload) => {
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: { doctor: true },
  });
  if (appointment.doctor.email !== user.email) {
    throw new Error("You are not authorized to update this appointment");
  }
  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new Error("Cannot update a completed appointment");
  }  
     // this is not your appointment
     if (user.role === UserRole.DOCTOR && appointment.doctor.email !== user.email) {
        throw new Error("You are not authorized to update this appointment");
    }
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });
  return updatedAppointment;
 }
export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
};
