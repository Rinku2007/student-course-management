const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const router = express.Router();

router.get("/", auth, getStudents);
router.post("/", auth, upload.single("profileImage"), createStudent);
router.put("/:id", auth, upload.single("profileImage"), updateStudent);
router.delete("/:id", auth, deleteStudent);

module.exports = router;
