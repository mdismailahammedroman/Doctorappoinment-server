import dotenv from "dotenv";

dotenv.config();
interface EnvConfig {
  PORT: string;
  JWT_SECRET: string;  
  FRONT_END_URL: string;  
}

const loadEnvVariables = (): EnvConfig => {
  const requierdEnvVariables: string[] = ["PORT", 
    "FRONT_END_URL",
    "JWT_SECRET"];
  requierdEnvVariables.forEach((element) => {
    if (!process.env[element]) {
      throw new Error(`MIssing require enviroment ${element}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,                        
    FRONT_END_URL: process.env.FRONT_END_URL as string,                        
  };
};

export const envVars = loadEnvVariables();
