import { z } from "zod";

const createPatientValidationSchema = z.object({
   patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email format"),
  }),
  password: z.string().nonempty("Password is required"),
});



export const UserValidationSchema = {
  createPatientValidationSchema,
};
