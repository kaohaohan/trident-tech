const app = require("../../app"); // Express app
const request = require("supertest");
const { expect } = require("chai");
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIs..."; // dummy JWT

describe("Courses API", () => {
  /* ----------------------------------------------------------- */
  describe("GET /courses", () => {
    it("returns 200 and an array of courses", async () => {
      const res = await request(app)
        .get("/courses?page=1&limit=2")
        .set("Authorization", TOKEN);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("respects the limit parameter (max 2 items)", async () => {
      const res = await request(app)
        .get("/courses?page=1&limit=2")
        .set("Authorization", TOKEN);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.at.most(2);
    });

    it("returns 401 when Authorization header is missing", async () => {
      const res = await request(app).get("/courses");
      expect(res.status).to.equal(401);
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
        instructorId: "ins001",
      };

      const res = await request(app)
        .post("/courses")
        .set("Authorization", TOKEN)
        .send(payload);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("id");
    });

    it("returns 400 when required fields are missing", async () => {
      const badPayload = { title: "Invalid", instructorId: "ins001" };

      const res = await request(app)
        .post("/courses")
        .set("Authorization", TOKEN)
        .send(badPayload);

      expect(res.status).to.equal(400);
    });
  });

  /* ----------------------------------------------------------- */
  describe("DELETE /courses/:courseId", () => {
    it("deletes a course and returns 204", async () => {
      // create a temp course first
      const { body: created } = await request(app)
        .post("/courses")
        .set("Authorization", TOKEN)
        .send({
          title: "Temp Course",
          description: "To be removed",
          startTime: "1300",
          endTime: "1400",
          instructorId: "ins001",
        });

      const res = await request(app)
        .delete(`/courses/${created.id}`)
        .set("Authorization", TOKEN);

      expect(res.status).to.equal(204);
    });
  });
});
