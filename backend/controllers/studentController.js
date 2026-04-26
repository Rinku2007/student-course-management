const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");

const withImagePath = (file) => (file ? `uploads/${file.filename}` : "");

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, age, course, status } = req.body;
    const exists = await Student.findOne({ email });

    if (exists) {
      return res.status(400).json({ success: false, message: "Student email already exists" });
    }

    const student = await Student.create({
      name,
      email,
      age,
      course,
      status,
      profileImage: withImagePath(req.file)
    });

    res.status(201).json({ success: true, message: "Student added", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (req.file) payload.profileImage = withImagePath(req.file);

    const student = await Student.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student updated", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.deleteStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Student.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     res.json({ success: true, message: "Student deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Student find karo
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 2. Image delete karo
    if (student.profileImage) {
      const imagePath = path.join(__dirname, "..", student.profileImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted:", imagePath);
      } else {
        console.log("Image not found:", imagePath);
      }
    }

    // 3. DB se delete
    await Student.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Student and image deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};