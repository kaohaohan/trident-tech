const express = require("express");
const ctl = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", ctl.signup);
router.post("/login", ctl.login);

module.exports = router;
