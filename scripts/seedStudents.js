const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Student = require("../model/student");
require("dotenv").config();

const uri = process.env.DB_URL;

const studentNames = [
  "Chloe Lin",
  "Alex Wang",
  "Emily Huang",
  "Ethan Liu",
  "Grace Chen",
  "Ryan Wu",
  "Ivy Chang",
  "Leo Tsai",
  "Sophia Ko",
  "Oscar Hsu",
];

async function seedStudents() {
  await mongoose.connect(uri);
  console.log("📦 connected to MongoDB");

  await Student.deleteMany(); // 清除現有學生資料

  const passwordHash = await bcrypt.hash("123456", 10);

  const students = studentNames.map((name, i) => ({
    name,
    email: `student${i + 1}@example.com`,
    passwordHash,
  }));

  await Student.insertMany(students);
  console.log("✅ 10 students created!");
  await mongoose.disconnect();
}

seedStudents();
