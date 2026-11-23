import express from "express";
import { createMonitor, getMonitors, updateMonitor, deleteMonitor } from "../controllers/monitor.controller.js";
import {protect} from "../middleware/auth.js"

const router = express.Router();

router.use(protect);

router.post("/" , createMonitor);
router.get("/" , getMonitors);

router.patch("/:id" , updateMonitor);
router.delete("/:id", deleteMonitor);

export default router;
