const app = require("../app"); // Express app
const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// db setup
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Instructor = require("../model/instructor");
const Course = require("../model/course");

let mongod;
let instructorAId;
let instructorBId;
let TOKEN;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const instructors = await Instructor.insertMany([
    {
      name: "Test Prof",
      email: "prof@test.com",
      passwordHash: "1234",
    },
    {
      name: "Test Prof2",
      email: "prof2@test.com",
      passwordHash: "1234",
    },
  ]);

  instructorAId = instructors[0]._id;
  instructorBId = instructors[1]._id;

  // 建立三門測試課程
  await Course.insertMany([
    {
      title: "Algorithms",
      description: "Sorting & Searching",
      startTime: "0900",
      endTime: "1100",
      instructorId: instructorAId,
    },
    {
      title: "Intro to Web",
      description: "HTML / CSS / JS",
      startTime: "1300",
      endTime: "1500",
      instructorId: instructorAId,
    },
    {
      title: "System Design",
      description: "infra structure",
      startTime: "1300",
      endTime: "1500",
      instructorId: instructorBId,
    },
  ]);

  // create TOKEN
  TOKEN =
    "Bearer " +
    jwt.sign({ id: instructorAId, role: "instrutor" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Courses API", () => {
  /* ----------------------------------------------------------- */
  describe("GET /courses", () => {
    it("returns 200 and an array of courses", async () => {
      const res = await request(app).get("/api/courses");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("respects the limit parameter (max 2 items)", async () => {
      const res = await request(app).get("/api/courses?page=1&limit=2");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.most(2);
    });
  });

  /* ----------------------------------------------------------- */
  describe("POST /courses", () => {
    it("creates a course and returns 201", async () => {
      const payload = {
        title: "Data Structures",
        description: "Stack / Queue / List",
        startTime: "0900",
        endTime: "1100",
        instructorId: instructorAId,
      };

      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", TOKEN)
        .send(payload);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("id");
    });

    it("returns 400 when required fields are missing", async () => {
      const badPayload = { title: "Invalid" };

      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", TOKEN)
        .send(badPayload);

      expect(res.status).to.equal(400);
    });

    it("returns 401 when Authorization header is missing", async () => {
      const res = await request(app).post("/api/courses").send({
        title: "Intro to React",
        description: "HTML / CSS / JS",
        startTime: "1100",
        endTime: "1300",
        instructorId: instructorAId,
      });
      expect(res.status).to.equal(401);
    });
  });

  /* ----------------------------------------------------------- */
  describe("DELETE /courses/:courseId", () => {
    it("deletes a course and returns 204", async () => {
      // create a temp course first
      const { body: created } = await request(app)
        .post("/api/courses")
        .set("Authorization", TOKEN)
        .send({
          title: "Temp Course",
          description: "To be removed",
          startTime: "1300",
          endTime: "1400",
          instructorId: instructorAId,
        });

      const res = await request(app)
        .delete(`/api/courses/${created.id}`)
        .set("Authorization", TOKEN);

      expect(res.status).to.equal(204);
    });
  });
});
