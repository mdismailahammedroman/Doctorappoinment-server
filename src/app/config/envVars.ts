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
  FRONT_END_URL: string;
  NODE_ENV: string;
  SALTROUND: string;
  CLOUDINARY: CloudinaryConfig;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "FRONT_END_URL",
    "JWT_SECRET",
    "NODE_ENV",
    "SALTROUND",
    "API_KEY",
    "API_SECRET",
    "CLOUDINARY_URL",
    "CLOUDINARY_NAME",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT!,
    JWT_SECRET: process.env.JWT_SECRET!,
    FRONT_END_URL: process.env.FRONT_END_URL!,
    NODE_ENV: process.env.NODE_ENV!,
    SALTROUND: process.env.SALTROUND!,
    CLOUDINARY: {
      API_KEY: process.env.API_KEY!,
      API_SECRET: process.env.API_SECRET!,
      CLOUDINARY_URL: process.env.CLOUDINARY_URL!,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME!,
    },
  };
};

export const envVars = loadEnvVariables();
