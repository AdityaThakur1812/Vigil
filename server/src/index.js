import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Vigil API running at http://localhost:${PORT}`);
  });
};

startServer();
