import express from "express";
import contractRoutes from "./routes/contracts.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/users.routes.js";
import skillRoutes from "./routes/skills.routes.js";
import jobRoutes from "./routes/jobs.routes.js"
import applicationRoutes from "./routes/applications.routes.js"

import { errorHandler } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());

app.use("/api/contracts", contractRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)

app.use(errorHandler)
export default app;
