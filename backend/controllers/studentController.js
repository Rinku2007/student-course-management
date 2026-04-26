const Student = require("../models/Student");
const cloudinary = require("../config/cloudinary");


// 🔹 GET ALL STUDENTS
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (error) {
    console.log("❌ GET ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔹 CREATE STUDENT (FIXED)
const createStudent = async (req, res) => {
  try {
    console.log("FILE:", JSON.stringify(req.file, null, 2));
    console.log("BODY:", req.body);

    const { name, email, age, course, status } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Safe image handling
    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename || req.file.public_id || "",
      };
    }

    const student = await Student.create({
      name,
      email,
      age,
      course,
      status,
      profileImage: imageData,
    });

    res.status(201).json({ success: true, student });

  } catch (err) {
  console.error("❌ CREATE ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message,
  });
}
};


// 🔹 UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const payload = { ...req.body };

    if (req.file) {
      // delete old image
      if (student.profileImage?.public_id) {
        await cloudinary.uploader.destroy(student.profileImage.public_id);
      }

      payload.profileImage = {
        url: req.file.path,
        public_id: req.file.filename || req.file.public_id || "",
      };
    }

    const updated = await Student.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: "Student updated", student: updated });

  } catch (error) {
    console.log("❌ UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// 🔹 DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // delete from cloudinary
    if (student.profileImage?.public_id) {
      await cloudinary.uploader.destroy(student.profileImage.public_id);
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted successfully" });

  } catch (err) {
    console.log("❌ DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ EXPORT
module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};