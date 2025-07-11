const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hi! 我是高浩瀚! 謝謝三宏科技給我這次機會面試 ! Please visit /api-docs for the OpenAPI UI.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
