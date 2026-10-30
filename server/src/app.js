import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import apiRoutes from "./api/routes/index.js"

const app = express();

dotenv.config();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);

app.use(express.json());

app.get("/api/health", (req,res) => {
    res.status(200).json({
        success: true,
        message : "Vigil API is running",
    });
});

app.use("/api",apiRoutes);
export default app;