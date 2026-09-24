import express from "express";
import categoryRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/users.routes.js";

const app = express();

app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

export default app;
