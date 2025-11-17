import { IJWTPayload } from "../../../types/common";
import { prisma } from "../../utils/prisma";
import { v4 as uuid } from "uuid";

const createAppoinment = async (
  user: IJWTPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });
  const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId = uuid();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
    });
    await tnx.doctorSchedules.update({
        where:{
            doctorId_scheduleId:{
                doctorId:doctorData.id,
                scheduleId:payload.scheduleId
            }
        },
        data:{
            isBooked:true,
        }
    })

            const transactionId = uuid();

       const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })
  });
  return result;
};

export const AppointmentService = {
  createAppoinment,
};
