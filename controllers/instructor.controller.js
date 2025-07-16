const Instructor = require("../model/instructor");
const Course = require("../model/course");

// POST /instructors   建講師
exports.createOne = async (req, res, next) => {
  try {
    const doc = await Instructor.create(req.body);
    res.status(201).json({ id: doc.id.toString() });
  } catch (err) {
    next(err);
  }
};

// GET /instructors  講師清單
exports.getAll = async (req, res, next) => {
  try {
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
    const { page, limit } = req.query;
    const courses = await Course.find({ instructorId: req.params.id })
      .skip((page - 1) * limit)
      .limit(limit);

    const mappedCourses = courses.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      description: c.description,
      startTime: c.startTime,
      endTime: c.endTime,
      instructorId: c.instructorId.toString(),
    }));

    res.json(mappedCourses);
  } catch (err) {
    next(err);
  }
};
