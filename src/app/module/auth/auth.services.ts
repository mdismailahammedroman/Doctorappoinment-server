import { UserStatus } from "@prisma/client"
import { prisma } from "../../utils/prisma"
import bcrypt from "bcryptjs"

const userLogin=async(payload:{email:string,password:string})=>{

    const LoginUser=await prisma.user.findFirstOrThrow({
        where:{
            email:payload.email,
           status:UserStatus.ACTIVE
        }
    })
 
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    LoginUser.password
  );

    if (!isCorrectPassword) {
        throw new Error("password is incorrect")
    }

}
export const authServices={
    userLogin
}