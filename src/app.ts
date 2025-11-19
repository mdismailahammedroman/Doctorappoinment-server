// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import { envVars } from "./app/config/envVars";
import golobalErrorHandler from "./app/middlewares/golobalErrorHandler";
import router from "./routes";
import cookieParser from "cookie-parser";
import { paymentController } from "./app/module/Payment/payment.controller";

const app: Application = express();

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    paymentController.stripeWebhookHandler
);

// 🧩 Middleware
app.use(express.json());
app.use(cookieParser())
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
app.use("/api/v1", router);

//golobal error handler
app.use(golobalErrorHandler)

export default app;
