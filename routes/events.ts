import { Router } from "express";

import { addEvent , updateEventById , deletedEventById , getEventById , getEventAll } from "../controllers/events.controller";

import authentication from "../middlewares/authentication";

const router = Router();

// ตรวจสอบการเข้าสู่ระบบก่อนเข้าถึง route นี้
router.use(authentication);

router.get("/", getEventAll);
router.post("/", addEvent);

// get event by id
router.get("/:id", getEventById);
// update event by id
router.put("/:id", updateEventById);
// delete event by id
router.delete("/:id", deletedEventById);

export default router;