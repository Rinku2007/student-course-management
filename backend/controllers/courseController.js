const Course = require("../models/Course");
const Student = require("../models/Student");

exports.getCourses = async (_req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    const withCounts = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Student.countDocuments({ course: course.name });
        return { ...course.toObject(), studentCount };
      })
    );

    res.json({ success: true, courses: withCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, code, status } = req.body;
    const exists = await Course.findOne({ code });
    if (exists) {
      return res.status(400).json({ success: false, message: "Course code already exists" });
    }

    const course = await Course.create({ name, code, status });
    res.status(201).json({ success: true, message: "Course added", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
