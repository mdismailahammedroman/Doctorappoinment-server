import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  UserRole,
} from "@prisma/client";
import { IJWTPayload } from "../../../types/common";
import { prisma } from "../../utils/prisma";
import { AppError } from "../../helpers/errorHelpers";

const CreatePrescription = async (
  user: IJWTPayload,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: payload.appointmentId,
      paymentStatus: PaymentStatus.PAID,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });
  if (
    user.role === UserRole.DOCTOR &&
    appointmentData.doctor.email !== user.email
  ) {
    throw new AppError(
      403,
      "You are not authorized to create prescription for this appointmnent"
    );
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};
export const prescriptionService = {
  CreatePrescription,
};
