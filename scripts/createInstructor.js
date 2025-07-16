require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Instructor = require("../model/instructor");

async function seedInstructors() {
  await mongoose.connect(process.env.DB_URL);
  console.log("✅ Connected to MongoDB");

  const instructors = [
    { name: "Emily Chen", email: "emily.chen@univ.edu" },
    { name: "Daniel Wong", email: "daniel.wong@univ.edu" },
    { name: "Sophia Lin", email: "sophia.lin@univ.edu" },
    { name: "James Huang", email: "james.huang@univ.edu" },
    { name: "Grace Liu", email: "grace.liu@univ.edu" },
    { name: "Kevin Zhang", email: "kevin.zhang@univ.edu" },
    { name: "Angela Yu", email: "angela.yu@univ.edu" },
    { name: "Eric Lee", email: "eric.lee@univ.edu" },
    { name: "Michelle Chang", email: "michelle.chang@univ.edu" },
    { name: "Jason Kao", email: "jason.kao@univ.edu" },
  ];

  for (const i of instructors) {
    const passwordHash = await bcrypt.hash("test1234", 10); // 統一密碼方便測試
    await Instructor.create({
      name: i.name,
      email: i.email,
      passwordHash,
    });
    console.log(`👨‍🏫 Created: ${i.name} (${i.email})`);
  }

  await mongoose.disconnect();
  console.log("✅ Done seeding instructors");
}

seedInstructors().catch((err) => {
  console.error("❌ Error seeding instructors", err);
});
