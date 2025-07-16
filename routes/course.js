// routes/course.js
const router = require("express").Router();
const ctl = require("../controllers/course.controller");
const auth = require("../middlewares/auth.middleware");

// 任何人都能看到課程列表
router.get("/", ctl.getAll);

// 任何人都能看到單一課程詳情（若 controller 實作）
router.get("/:courseId", ctl.getOne);

// 以下操作需要驗證後才能使用
router.post("/", auth.verifyToken, ctl.createOne);
router.put("/:courseId", auth.verifyToken, ctl.updateOne);
router.delete("/:courseId", auth.verifyToken, ctl.deleteOne);

module.exports = router;
