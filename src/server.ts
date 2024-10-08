import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/bd";
import authRoutes from "./routes/authRoutes";
import shopRoutes from "./routes/shopRoutes";
import morgan from "morgan";

dotenv.config();
connectDB();
const app = express();

app.use(cors(corsConfig));

app.use(morgan("dev"));

app.use(express.json());

// Route
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);

export default app;
