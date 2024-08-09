import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./config/bd";
import shopRoutes from './routes/shopRoutes'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
// Routes

app.use('/api/shops', shopRoutes)

export default app