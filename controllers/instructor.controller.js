const Instructor = require("../model/instructor");
const Course = require("../model/course");

// POST /instructors   建講師
exports.createOne = async (req, res, next) => {
  try {
    const doc = await Instructor.create(req.body);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    next(err);
  }
};

// GET /instructors  講師清單
exports.getAll = async (req, res, next) => {
  try {
    console.log("reqQuery:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const instructors = await Instructor.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(instructors);
  } catch (err) {
    next(err);
  }
};

// GET /instructors/:id/courses  該講師的課程
exports.getAllCoursesByInstructor = async (req, res, next) => {
  try {
    console.log(req.params);
    const courses = await Course.find({ instructorId: req.params.id });
    res.json(courses);
  } catch (err) {
    next(err);
  }
};
