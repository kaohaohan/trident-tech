require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const fs = require("fs");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected");
    fs.writeFileSync(
      "./public/config.js",
      `window.ENV = { API_BASE_URL: "${process.env.API_BASE_URL}" };`
    );
    // 啟動 Express 應用程式，監聽 Render 指定的 PORT（或預設 10000）
    // host 必須綁定在 '0.0.0.0'，Render 才能從外部訪問這個服務
    app.listen(process.env.PORT || 10000, "0.0.0.0", () => {
      console.log("Server is running...");
    });
  })
  .catch(console.error);
