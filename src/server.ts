// src/index.ts
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import { Server } from "node:http";
import { PrismaClient } from "@prisma/client";
import { envVars } from "./app/config/envVars";

dotenv.config();

// Initialize Express App
const app: Application = express();

// JSON parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: envVars.FRONT_END_URL || "http://localhost:5173",
    credentials: true, // Allow sending cookies, auth headers, etc.
  })
);

// Initialize Prisma Client
const prisma = new PrismaClient();

// Declare server variable for graceful shutdown
let server: Server;

// Port setup
const PORT = parseInt(envVars.PORT, 10) || 5000;

// Basic route
app.get("/", (req, res) => {
  res.send("✅ Doctor Appointment API is running!");
});

/**
 * 🟢 Start Express Server
 */
server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/**
 * Example async function to test Prisma DB connection
 */
async function startServer() {
  try {
    const users = await prisma.user.findMany();
    console.log("✅ Users:", users);
  } catch (err) {
    console.error(" Error connecting to database:", err);
  }
}

(async () => {
  await startServer();
})();

/* ---------------------------------------------------
   🔥 GLOBAL ERROR & SHUTDOWN HANDLERS
   Handle unexpected errors and OS signals gracefully.
--------------------------------------------------- */

// 🧠 Handle uncaught synchronous exceptions
process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception... Server shutting down.", err);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// ⚡ Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("⚠️ Unhandled Rejection... Server shutting down.", error);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// 🧹 Handle system termination signal (e.g. Docker, Kubernetes)
process.on("SIGTERM", (signal) => {
  console.log("🧩 SIGTERM received... Server shutting down gracefully.", signal);

  if (server) {
    server.close(async () => {
      console.log("✅ Server closed.");
      await prisma.$disconnect();
      process.exit(0);
    });
  }
});

// 🧹 Handle Ctrl+C (manual stop)
process.on("SIGINT", (signal) => {
  console.log("🧩 SIGINT received (Ctrl+C)... Server shutting down.", signal);

  if (server) {
    server.close(async () => {
      console.log("✅ Server closed.");
      await prisma.$disconnect();
      process.exit(0);
    });
  }
});
