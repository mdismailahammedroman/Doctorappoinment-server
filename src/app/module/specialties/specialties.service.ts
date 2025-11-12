import { filUploder } from "../../helpers/fileUploder";
import { prisma } from "../../utils/prisma";

const createSpecialtie=async(req: Request)=>{
      const file = req.file;
          if (file) {
        const uploadToCloudinary = await filUploder.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
};



export const SpecialtiesService={
    createSpecialtie
}