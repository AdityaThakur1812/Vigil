import express from "express"
import authRoutes from "./auth.routes.js"
import monitorRoutes from "./monitor.routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/monitors", monitorRoutes)

export default router;