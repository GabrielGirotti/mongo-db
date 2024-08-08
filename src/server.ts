import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./config/bd";
import listRoutes from './routes/listRoutes'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
// Routes

app.use('/api/lists', listRoutes)

export default app