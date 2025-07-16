const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    startTime: { type: String, match: /^\d{4}$/ },
    endTime: { type: String, match: /^\d{4}$/ },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Course", courseSchema);
