import { Router } from "express";

import { add , updateLogById , deleteLogById , getLogById , getAllLog } from "../controllers/logs.controller";

import authentication from "../middlewares/authentication";
import { get } from "http";

const router = Router();

// ตรวจสอบการเข้าสู่ระบบก่อนเข้าถึง route นี้
router.use(authentication);

router.get("/", getAllLog);
router.post("/", add);

router.get("/logs/:id", getLogById);
router.put("/logs/:id", updateLogById);
router.delete("/logs/:id", deleteLogById);

export default router;