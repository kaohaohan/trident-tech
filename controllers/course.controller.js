const Course = require("../model/course");
const mongoose = require("mongoose");

// GET /courses?page=1&limit=2
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.query;

    const rawCourses = await Course.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("instructorId", "name email");

    const courses = rawCourses.map((c) => {
      const obj = c.toObject();
      obj.instructor = obj.instructorId;
      delete obj.instructorId;
      return obj;
    });

    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /courses/:courseId  取得單一課程詳情
exports.getOne = async (req, res, next) => {
  try {
    // 確保傳入的是合法 ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(req.params.courseId).populate(
      "instructorId",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 對齊前端期望：把 instructorId 轉成 instructor
    const obj = course.toObject();
    obj.instructor = obj.instructorId;
    delete obj.instructorId;

    res.json(obj);
  } catch (err) {
    next(err);
  }
};
// POST /courses
exports.createOne = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor")
      return res
        .status(403)
        .json({ message: "Only the an instructor could create a course" });

    const doc = await Course.create(req.body);
    res.status(201).json({ id: doc.id });
  } catch (err) {
    next(err);
  }
};

// DELETE /courses/:courseId
exports.deleteOne = async (req, res, next) => {
  const course = await Course.findOne({ _id: req.params.courseId });

  if (!course) return res.sendStatus(204);

  //只有講師才能刪掉自己課程
  if (course.instructorId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Only the owner of the class can delete the course" });
  }

  await Course.findByIdAndDelete(req.params.courseId);

  res.sendStatus(204);
};

//update
exports.updateOne = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });
    if (course.instructorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the owner of the class can update the course" });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true }
    );

    return res.json({
      id: updatedCourse._id.toString(),
      title: updatedCourse.title,
      description: updatedCourse.description,
      startTime: updatedCourse.startTime,
      endTime: updatedCourse.endTime,
      instructorId: updatedCourse.instructorId.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
