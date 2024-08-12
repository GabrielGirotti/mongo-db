import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/bd";
import shopRoutes from "./routes/shopRoutes";

dotenv.config();
connectDB();
const app = express();

app.use(cors(corsConfig));

app.use(express.json());

// Route
app.use("/api/shops", shopRoutes);

export default app;
