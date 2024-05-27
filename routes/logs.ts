import { Router } from "express";

import { add , updateLogById , deleteLogById , getLogById , getAllLog } from "../controllers/logs.controller";

import authentication from "../middlewares/authentication";

const router = Router();

// ตรวจสอบการเข้าสู่ระบบก่อนเข้าถึง route นี้
router.use(authentication);

router.get("/", getAllLog);
router.post("/", add);

router.get("/:id", getLogById);
router.put("/:id", updateLogById);
router.delete("/:id", deleteLogById);

export default router;