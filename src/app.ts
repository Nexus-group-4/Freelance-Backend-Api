import express from "express";
import contractRoutes from "./routes/contracts.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/users.routes.js";
import skillRoutes from "./routes/skills.routes.js";

const app = express();

app.use(express.json());

app.use("/api/contracts", contractRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);

export default app;
