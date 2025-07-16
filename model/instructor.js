const { Schema, model } = require("mongoose");

const instructorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Instructor", instructorSchema);
