import { z } from "zod";

const createPatientValidationSchema = z.object({
   patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email format"),
  }),
  password: z.string().nonempty("Password is required"),
});


const createDoctorValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  doctor: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    contactNumber: z.string().min(10),
    address: z.string().optional(),
    registrationNumber: z.string().min(3),
    experience: z.number().int().nonnegative(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number().int().positive(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
    profilePhoto: z.string().optional(),
  }),
});

const createAdminValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  admin: z.object({
    email: z.string().email(),
    name: z.string().min(1, "Name is required"),
    contactNumber: z.string().min(10, "Invalid contact number"),
    profilePhoto: z.string().optional(),
  }),
});


export const UserValidationSchema = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema
};
