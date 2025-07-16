const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../model/student");
const Instructor = require("../model/instructor");

const jwtSecret = process.env.JWT_SECRET || "dev_secret";

// POST /auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["student", "instructor"].includes(role))
      return res
        .status(400)
        .json({ msg: "role must be student or instructor" });

    // 依 role 選定 Model
    const Model = role === "student" ? Student : Instructor;

    // 只檢查該 Model 是否重複
    if (await Model.exists({ email }))
      return res.status(409).json({ msg: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const doc = await Model.create({ name, email, passwordHash });

    res.status(201).json({ id: doc.id, role });
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
exports.login = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    // 根據 role 選對的 model
    let Model;
    if (role === "student") Model = Student;
    else if (role === "instructor") Model = Instructor;
    else return res.status(400).json({ msg: "Invalid role" });

    // 查詢該角色表單
    const user = await Model.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    // 密碼驗證
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    // JWT
    const token = jwt.sign({ id: user._id, role }, jwtSecret, {
      expiresIn: "6h",
    });

    res.json({ token, role });
  } catch (err) {
    next(err);
  }
};
