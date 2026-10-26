import dotenv from "dotenv"
import app from "./app.js"

dotenv.config();

const PORT = process.env.PORT || 5002 ;

app.listen(PORT, () => {
    console.log(`Vigil API running at http://localhost:${PORT}`);
});