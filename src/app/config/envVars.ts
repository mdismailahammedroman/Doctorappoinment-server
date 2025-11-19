import dotenv from "dotenv";

dotenv.config();

interface CloudinaryConfig {
  API_KEY: string;
  API_SECRET: string;
  CLOUDINARY_URL: string;
  CLOUDINARY_NAME: string;
}

interface EnvConfig {
  PORT: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE:string,
  FRONT_END_URL: string;
  NODE_ENV: string;
  SALTROUND: string;
  CLOUDINARY: CloudinaryConfig;
  OPENROUTER_API:string;
  STRIP_SCERECT_KEY:string;
  STRIPE_WEBHOOK_SCRECT:string

}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "FRONT_END_URL",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_EXPIRE",
    "NODE_ENV",
    "SALTROUND",
    "API_KEY",
    "API_SECRET",
    "CLOUDINARY_URL",
    "CLOUDINARY_NAME",
    "OPENROUTER_API",
    "STRIP_SCERECT_KEY",
    "STRIPE_WEBHOOK_SCRECT",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRE: process.env.JWT_EXPIRE!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    FRONT_END_URL: process.env.FRONT_END_URL!,
    NODE_ENV: process.env.NODE_ENV!,
    SALTROUND: process.env.SALTROUND!,
    CLOUDINARY: {
      API_KEY: process.env.API_KEY!,
      API_SECRET: process.env.API_SECRET!,
      CLOUDINARY_URL: process.env.CLOUDINARY_URL!,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME!,
    },
    OPENROUTER_API:process.env.OPENROUTER_API!,
    STRIP_SCERECT_KEY:process.env.STRIP_SCERECT_KEY!,
    STRIPE_WEBHOOK_SCRECT:process.env.STRIPE_WEBHOOK_SCRECT!,
  };
};

export const envVars = loadEnvVariables();
