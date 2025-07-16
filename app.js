const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapiDoc = require("./openapi.json");
const courseRouter = require("./routes/course");
const instructorRouter = require("./routes/instructor");
const authRouter = require("./routes/auth");
const OpenApiValidator = require("express-openapi-validator");

const path = require("path");

const app = express();

/* -------- middlewares -------- */
app.use(express.json());

/* -------- OpenApiValidator -------- */
app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, "./openapi.json"),
    validateRequests: true,
    validateResponses: true,
  })
);

/* -------- routes -------- */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

// register all routes
app.use("/api/auth", authRouter);
app.use("/api/instructors", instructorRouter);
app.use("/api/courses", courseRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/signup.html");
});

module.exports = app;
