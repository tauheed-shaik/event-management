import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import csurf from "csurf";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import registrationRoutes from "./src/routes/registrationRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

const origin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin, credentials: true }));
app.use(morgan("dev"));

app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));

if(process.env.ENABLE_CSRF === "1"){
  app.use(csurf({
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }
  }));

  app.get("/api/csrf-token", (req, res) => res.json({ csrfToken: req.csrfToken() }));
}

app.get("/", (req, res) => res.json({ message: "Event Backend running ✅" }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start(){
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}
start();
