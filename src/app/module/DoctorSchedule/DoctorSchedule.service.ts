import { email } from "zod"
import { IJWTPayload } from "../../../types/common"
import { prisma } from "../../utils/prisma"


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


export const doctorScheduleService={
    insertInTodb
}