import express from "express";
import { createMonitor, getMonitors,  } from "../controllers/monitor.controller.js";
import {protect} from "../middleware/auth.js"

const router = express.Router();

router.use(protect);

router.post("/" , createMonitor);
router.get("/" , getMonitors);

export default router;
