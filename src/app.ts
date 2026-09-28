import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { env } from "./config/env.js";
import contractRoutes from "./routes/contracts.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/users.routes.js";
import skillRoutes from "./routes/skills.routes.js";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import applicationRouter from "./routes/applications.routes.js";
import jobRouter from "./routes/jobs.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({limit: "20kb"}));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/contracts", contractRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use('/api/applications', applicationRouter);
app.use("/api/jobs", jobRouter);

app.use(errorHandler);

export default app;
