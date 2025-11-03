// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import { envVars } from "./app/config/envVars";
import { UserRouter } from "./app/module/user/user.router";
import golobalErrorHandler from "./app/middlewares/golobalErrorHandler";

const app: Application = express();

// 🧩 Middleware
app.use(express.json());
app.use(
  cors({
    origin: envVars.FRONT_END_URL || "*", 
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.send("✅ Doctor Appointment API is running!");
});

//  routers
app.use("/api/v1/users", UserRouter);

//golobal error handler
app.use(golobalErrorHandler)

export default app;
