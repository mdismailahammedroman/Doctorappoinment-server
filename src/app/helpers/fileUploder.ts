import multer from "multer"
import path from "path"
import { envVars } from "../config/envVars"
import { v2 as cloudinary } from 'cloudinary';



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(),"/uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const uploadToCloudinary=async(file: Express.Multer.File)=>{
    
    // Configuration
    cloudinary.config({ 
        cloud_name:envVars.CLOUDINARY.CLOUDINARY_NAME, 
        api_key: envVars.CLOUDINARY.API_KEY, 
        api_secret: envVars.CLOUDINARY.API_SECRET // Click 'View API Keys' above to copy your API secret
    });

     // Upload an image.
     const uploadResult = await cloudinary.uploader
       .upload(
           file.path, {
               public_id: file.filename,
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
   return uploadResult;
}



export const filUploder={
  upload,
  uploadToCloudinary,
}