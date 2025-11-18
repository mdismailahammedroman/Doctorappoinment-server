import { IJWTPayload } from "../../../types/common";
import { stripe } from "../../helpers/stripe";
import { prisma } from "../../utils/prisma";
import { v4 as uuid } from "uuid";


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

export const AppointmentService = {
  createAppointment,
};
