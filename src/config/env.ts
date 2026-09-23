import "dotenv/config";
import { envSchema } from "../schemas/auth.schemas.js";

export const env = envSchema.parse(process.env);