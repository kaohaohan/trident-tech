require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../model/course");
const Instructor = require("../model/instructor");

const DB_URL = process.env.DB_URL;

const seedCourses = async () => {
  await mongoose.connect(DB_URL);
  console.log("📦 connected to MongoDB");

  const instructors = await Instructor.find().limit(5);
  if (instructors.length === 0) {
    console.log("❌ No instructors found. Please seed instructors first.");
    return;
  }

  const sampleCourses = [
    "Intro to Web Development",
    "Advanced JavaScript",
    "Backend with Node.js",
    "Fullstack Project Bootcamp",
    "Intro to Python",
    "Machine Learning 101",
    "Database Design Basics",
    "React for Beginners",
    "APIs and RESTful Services",
    "Cloud Fundamentals",
  ];

  for (let i = 0; i < sampleCourses.length; i++) {
    const instructor = instructors[i % instructors.length];
    await Course.create({
      title: sampleCourses[i],
      description: `This is a course about ${sampleCourses[i].toLowerCase()}.`,
      instructorId: instructor._id,
      startTime: "0900",
      endTime: "1100",
    });
    console.log(`✅ Created: ${sampleCourses[i]} by ${instructor.name}`);
  }

  mongoose.disconnect();
};

seedCourses();
