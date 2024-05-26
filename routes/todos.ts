import { Router } from "express";

import { Add, All, Deleted, Get, Update } from "../controllers/todos.controller";

import authentication from "../middlewares/authentication";

const router = Router();

// ตรวจสอบการเข้าสู่ระบบก่อนเข้าถึง route นี้
router.use(authentication);

// get all todos
router.get("/", All);
// add todos
router.post("/", Add);

// get todos by id
router.get("/:id", Get);
// update todos by id
router.put("/:id", Update);
// delete todos by id
router.delete("/:id", Deleted);

export default router;