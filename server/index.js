import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js"
import connectDb from "./config/db.js"
import cors from "cors";

dotenv.config();
connectDb();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));