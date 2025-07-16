const express = require("express");
const ctl = require("../controllers/instructor.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", ctl.getAll);
router.post("/", auth.verifyToken, ctl.createOne);
router.get("/:id/courses", ctl.getAllCoursesByInstructor);

module.exports = router;
