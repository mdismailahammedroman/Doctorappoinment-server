import express, { Application } from "express";
import cors from "cors";
import { envVars } from "./app/config/envVars";
import { UserRouter } from "./app/module/user/user.router";


const app: Application = express();

// Parse JSON body
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: envVars.FRONT_END_URL,
    credentials: true,
  })
);

// Example base route
app.get("/", (req, res) => {
  res.send("✅ Doctor Appointment API is running!");
});

// Register routers
app.use("/api/v1/users", UserRouter);

export default app;
