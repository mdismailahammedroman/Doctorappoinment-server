import { prisma } from "../../utils/prisma";
import { createUserInput } from "./user.interface";
import bcrypt from "bcryptjs";

const createUser = async (paload: createUserInput) => {
  const hashedPassword = await bcrypt.hash(paload.password, 10);
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: paload.email,
        password: hashedPassword
      }
    });
    return await tnx.patient.create({
      data: {
        email: paload.email,
        name: paload.name
      }
    });
  });
  return result;
};


export const UserServices = {
  createUser,
};
