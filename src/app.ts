import express from "express";
import contractRoutes from "./routes/contracts.routes.js";


const app = express();
app.use(express.json());
app.use("/api/contracts", contractRoutes);

export default app;